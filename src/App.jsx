import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import logo from './assets/logo.png'
import SwipeCard from './components/SwipeCard'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import TinderCard from 'react-tinder-card'
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [lunches, setLunches] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3000/scrape');
        setLunches(response.data);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);

  const onSwipe = (direction) => {
    console.log('You swiped: ' + direction)
  }

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen')
  }

  return (
    <>
      {/* NAVBAR */}
      <Navbar className="bg-red fixed-top w-100 text-light fw-bold">
        <Container fluid className="d-flex justify-content-start align-items-center">
          <Navbar.Brand href="#home" className="text-light">
            <img
              alt="titrate logo"
              src={logo}
              width="70"
              height="60"
              className="align-top"
            />
          </Navbar.Brand>
          <Nav className="justify-content-center">
            <Nav.Link href="#about" className="text-light">O nás</Nav.Link>
            <Nav.Link href="#services" className="text-light">Login/Profil</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      {/* MAIN SECTION */}
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column mt-5">
        {/* <h1>TitRate</h1> */}

        <TinderCard onSwipe={onSwipe} onCardLeftScreen={() => onCardLeftScreen('foobar')} preventSwipe={['right','left']}><SwipeCard  /></TinderCard>

        <div className="App">
          <h1>Scraped Lunches from JECNA</h1>
          {lunches.length > 0 ? (
            <ul>
              {lunches.map((lunch, index) => (
                <li key={index}>
                  <strong>{lunch.day}</strong>: {lunch.lunchNumber} - {lunch.lunchDescription}
                </li>
              ))}
            </ul>
          ) : (
            <p>No lunches found.</p>
          )}
        </div>

        {/* <div className='d-flex flex-row gap-5 ratings'>
            <Rating defaultRating={2} onRate={(rating) => console.log("Vybrané hodnocení:", rating)} />
          <Rating defaultRating={2} onRate={(rating) => console.log("Vybrané hodnocení:", rating)} />
            <Rating defaultRating={2} onRate={(rating) => console.log("Vybrané hodnocení:", rating)} />
          </div> */}
      </div>  

      {/* FOOTER */}
      <footer className="bg-red text-center py-3 mt-auto">
        <img
          alt="titrate logo"
          src={logo}
          width="70"
          height="60"
          className="align-top"
        />
      </footer>
    </>
  )
}

export default App;