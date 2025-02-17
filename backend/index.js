const express = require("express");
const axios = require("axios");
const cheerio = require("cheerio");

const app = express();
const PORT = 3000;

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
    console.log(currentWeekData);
    res.json(currentWeekData);
  } catch (error) {
    res.status(500).send("Error occurred while scraping");
  }
});

app.get("/scrape/today", async (req, res) => {
  console.log("Scraping for current day...");
  try {
    const scrapedData = await scrapeData();
    const today = new Date().toDateString();
    const todayData = scrapedData.filter(
      (lunch) => parseDate(lunch.day).toDateString() === today
    );
    console.log(todayData);
    res.json(todayData);
  } catch (error) {
    res.status(500).send("Error occurred while scraping");
  }
});

app.listen(PORT, async () => {
  console.log(`Server is running on http://localhost:${PORT}`);
  try {
    const scrapedData = await scrapeData();
    console.log("All lunches:", scrapedData);

    const currentWeekData = scrapedData.filter((lunch) => {
      const lunchDate = parseDate(lunch.day);
      const now = new Date();
      const startOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const endOfWeek = new Date(now.setDate(now.getDate() - now.getDay() + 6));
      return lunchDate >= startOfWeek && lunchDate <= endOfWeek;
    });
    console.log("Current week lunches:", currentWeekData);

    const today = new Date().toDateString();
    const todayData = scrapedData.filter(
      (lunch) => parseDate(lunch.day).toDateString() === today
    );
    console.log("Today's lunches:", todayData);
  } catch (error) {
    console.error("Error occurred while scraping:", error);
  }
});
