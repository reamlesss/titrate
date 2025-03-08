const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");
const cors = require("cors");
const puppeteer = require("puppeteer");
const mysql = require("mysql");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "trapovejgulas",
  database: "titrate",
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");
});

const scrapeData = async () => {
  const url = "https://strav.nasejidelna.cz/0341/login";
  const { data } = await axios.get(url);
  const $ = cheerio.load(data);
  const scrapedData = [];

  $(".jidelnicekDen").each((index, element) => {
    const day = $(element).find(".jidelnicekTop").text().trim();
    $(element)
      .find("article .container")
      .each((i, el) => {
        const location = $(el).find("span").text().trim();
        if (location.includes("Ječná")) {
          const lunchNumber = $(el).find(".shrinkedColumn span").text().trim();
          let lunchDescription = $(el)
            .find(".jidelnicekItem")
            .last()
            .text()
            .trim();
          lunchDescription = lunchDescription
            .replace(/\n/g, " ")
            .replace(/\s\s+/g, " ");
          const lunchData = {
            day,
            lunchNumber,
            lunchDescription,
          };
          scrapedData.push(lunchData);
        }
      });
  });

  return scrapedData;
};

const parseDate = (dateString) => {
  const dateMatch = dateString.match(/(\d{2}\.\d{2}\.\d{4})/);
  if (dateMatch) {
    const [day, month, year] = dateMatch[0].split(".");
    return new Date(`${year}-${month}-${day}`);
  }
  return null;
};

app.get("/scrape", async (req, res) => {
  console.log("Scraping...");
  try {
    const scrapedData = await scrapeData();
    res.json(scrapedData);
  } catch (error) {
    res.status(500).send("Error occurred while scraping");
  }
});

app.get("/scrape/week", async (req, res) => {
  console.log("Scraping for current week...");
  try {
    const scrapedData = await scrapeData();
    const currentWeekData = scrapedData.filter((lunch) => {
      const lunchDate = parseDate(lunch.day);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return lunchDate >= startOfWeek && lunchDate <= endOfWeek;
    });
    res.json(currentWeekData);
  } catch (error) {
    res.status(500).send("Error occurred while scraping");
  }
});

app.post("/food", (req, res) => {
  const { name } = req.body;
  const query = "INSERT INTO food (name) VALUES (?)";
  db.query(query, [name], (err, result) => {
    if (err) {
      console.error("Error inserting food:", err);
      res.status(500).send("Error inserting food");
      return;
    }
    res.json({ success: true, foodId: result.insertId });
  });
});


app.get("/scrape/today", async (req, res) => {
  console.log("Scraping for current day...");
  try {
    const scrapedData = await scrapeData();
    const today = new Date().toLocaleDateString("cs-CZ", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
    const todayData = scrapedData.filter(
      (lunch) =>
        parseDate(lunch.day).toLocaleDateString("cs-CZ", {
          day: "2-digit",
          month: "2-digit",
          year: "numeric",
        }) === today
    );
    res.json(todayData);
  } catch (error) {
    res.status(500).send("Error occurred while scraping");
  }
});

app.get("/user/:username", (req, res) => {
  const { username } = req.params;
  const query = "SELECT id FROM user WHERE username = ?";
  db.query(query, [username], (err, results) => {
    if (err) {
      console.error("Error fetching user ID:", err);
      res.status(500).send("Error fetching user ID");
      return;
    }
    if (results.length === 0) {
      res.status(404).send("User not found");
      return;
    }
    console.log(results[0].id);
    res.json({ userId: results[0].id });
  });
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const loginUrl = "https://strav.nasejidelna.cz/0341/login";

  console.log(
    "Received login request with username:",
    username,
    "and password:",
    password
  );

  try {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto(loginUrl);

    console.log("Navigated to login page");

    console.log("Typing username:", username, "of type:", typeof username);
    console.log("Typing password:", password, "of type:", typeof password);

    await page.type("#j_username", String(username));
    await page.type("#j_password", String(password));
    await page.click('input[type="submit"]');

    console.log("Submitted login form");

    await page.waitForNavigation();

    const currentUrl = page.url();
    const success = currentUrl.includes(
      "https://strav.nasejidelna.cz/0341/faces/secured/main.jsp?status=true"
    );

    console.log("Login success:", success);

    if (success) {
      const query = "SELECT * FROM user WHERE username = ?";
      db.query(query, [username], (err, results) => {
        if (err) {
          console.error("Error checking user:", err);
          res.status(500).send("Error checking user");
          return;
        }

        if (results.length === 0) {
          const insertQuery = "INSERT INTO user (username) VALUES (?)";
          db.query(insertQuery, [username], (insertErr, insertResult) => {
            if (insertErr) {
              console.error("Error inserting user:", insertErr);
              res.status(500).send("Error inserting user");
              return;
            }
            console.log("User created with ID:", insertResult.insertId);
            res.json({ success: true, userId: insertResult.insertId });
          });
        } else {
          console.log("User already exists with ID:", results[0].id);
          res.json({ success: true, userId: results[0].id });
        }
      });
    } else {
      res.json({ success: false });
    }

    await browser.close();
  } catch (error) {
    console.error("Error during login attempt:", error);
    if (error.message.includes("500")) {
      res
        .status(500)
        .send(
          "Jidelna website is currently experiencing issues. Please try again later."
        );
    } else {
      res.status(500).send("Error occurred while attempting to log in");
    }
  }
});

app.post("/user", (req, res) => {
  const { username } = req.body;
  const query = "INSERT INTO user (username) VALUES (?)";
  db.query(query, [username], (err, result) => {
    if (err) {
      console.error("Error inserting user:", err);
      res.status(500).send("Error inserting user");
      return;
    }
    res.json({ success: true, userId: result.insertId });
  });
});



app.post("/rating", (req, res) => {
  const { user_id, food_id, rating } = req.body;
  const query =
    "INSERT INTO rating (user_id, food_id, rating) VALUES (?, ?, ?)";
  db.query(query, [user_id, food_id, rating], (err, result) => {
    if (err) {
      console.error("Error inserting rating:", err);
      res.status(500).send("Error inserting rating");
      return;
    }
    res.json({ success: true, ratingId: result.insertId });
  });
});

app.post("/additionalQuestions", (req, res) => {
  const {
    user_id,
    rating_id,
    temperature_rating,
    portion_rating,
    appearance_rating,
  } = req.body;
  const query =
    "INSERT INTO additionalQuestions (user_id, rating_id, temperature_rating, portion_rating, appearance_rating) VALUES (?, ?, ?, ?, ?)";
  db.query(
    query,
    [user_id, rating_id, temperature_rating, portion_rating, appearance_rating],
    (err, result) => {
      if (err) {
        console.error("Error inserting additional questions:", err);
        res.status(500).send("Error inserting additional questions");
        return;
      }
      res.json({ success: true, additionalQuestionsId: result.insertId });
    }
  );
});

app
  .listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    try {
      const scrapedData = await scrapeData();
      console.log("All lunches:", scrapedData);

      const currentWeekData = scrapedData.filter((lunch) => {
        const lunchDate = parseDate(lunch.day);
        const now = new Date();
        const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
        const endOfWeek = new Date(
          now.setDate(now.getDate() - now.getDay() + 6)
        );
        return lunchDate >= startOfWeek && lunchDate <= endOfWeek;
      });
      console.log("Current week lunches:", currentWeekData);

      const today = new Date().toLocaleDateString("cs-CZ", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      });
      const todayData = scrapedData.filter(
        (lunch) =>
          parseDate(lunch.day).toLocaleDateString("cs-CZ", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
          }) === today
      );
      console.log("Today's lunches:", todayData);
    } catch (error) {
      console.error("Error occurred while scraping:", error);
    }
  })
  .on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `Port ${PORT} is already in use. Please use a different port.`
      );
      process.exit(1);
    } else {
      console.error("Server error:", err);
    }
  });
