import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import logo from './assets/logo.png';
import SwipeCard from './components/SwipeCard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TinderCard from 'react-tinder-card';
import React, { useEffect, useState } from 'react';
import axios from 'axios';

function App() {
  const [todayLunches, setTodayLunches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeClass, setSwipeClass] = useState('');

  useEffect(() => {
    const fetchTodayLunches = async () => {
      try {
        const response = await axios.get('http://localhost:3000/scrape/today');
        setTodayLunches(response.data);
      } catch (error) {
        console.error('Error fetching today\'s lunches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayLunches();
  }, []);

  const onSwipe = (direction) => {
    if (direction === 'left') {
      console.log('didn\'t like');
      setSwipeClass('swipe-left');
    } else if (direction === 'right') {
      console.log('did like');
      setSwipeClass('swipe-right');
    }
    setTimeout(() => {
      setCurrentIndex((prevIndex) => prevIndex + 1);
      setSwipeClass('');
    }, 800); // Match the duration of the swipe animations
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen');
  };

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
        {!loading && todayLunches.length > 0 && currentIndex < todayLunches.length && (
          <h1 className='mb-5 info-heading'>
            Swipuj jako na tinderu!
          </h1>
        )}

        {!loading && (todayLunches.length === 0 || currentIndex >= todayLunches.length) && (
          <h1 className='mb-5 no-lunches-heading'>
            Už nejsou žádné obědy
          </h1>
        )}

        {loading ? (
          <Spinner animation="border" role="status" size="lg" variant="danger">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        ) : todayLunches.length > 0 && currentIndex < todayLunches.length ? (
          <TinderCard
            key={currentIndex}
            onSwipe={onSwipe}
            onCardLeftScreen={() => onCardLeftScreen(todayLunches[currentIndex].lunchNumber)}
            preventSwipe={['up', 'down']}
          >
            <div className={swipeClass}>
              <SwipeCard lunch={todayLunches[currentIndex]} />
            </div>
          </TinderCard>
        ) : (
          <p className='fs-1 d-none'>Už nejsou žádné obědy.</p>
        )}
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
  );
}

export default App;