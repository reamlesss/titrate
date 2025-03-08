import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Spinner from 'react-bootstrap/Spinner';
import logo from './assets/logo.png';
import SwipeCard from './components/SwipeCard';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import TinderCard from 'react-tinder-card';
import { useEffect, useState } from 'react';
import Login from './components/Login';
import axios from 'axios';
import AdditionalQuestions from './components/AdditionalQuestions';
import { Route, Routes, Navigate, Link } from 'react-router-dom';
import Menu from './components/Menu';

function App() {
  const [todayLunches, setTodayLunches] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [swipeClass, setSwipeClass] = useState('');
  const [isWeekend, setIsWeekend] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showAdditionalQuestions, setShowAdditionalQuestions] = useState(false);
  const [selectedLunch, setSelectedLunch] = useState(null);
  const [userId, setUserId] = useState(null);
  const [ratingId, setRatingId] = useState(null);

  useEffect(() => {
    const fetchTodayLunches = async () => {
      const today = new Date();
      const dayOfWeek = today.getDay();
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setIsWeekend(true);
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('http://localhost:3000/today');
        setTodayLunches(response.data);
      } catch (error) {
        console.error('Error fetching today\'s lunches:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTodayLunches();
  }, []);

  useEffect(() => {

    
    const storedUserId = localStorage.getItem('userId');
    if (storedUserId) {
      setUserId(storedUserId);
      setIsLoggedIn(true);
    }
  }, []);

  const onSwipe = async (direction) => {
    const liked = direction === 'right';
    const lunch = todayLunches[currentIndex];

    try {
      const response = await axios.post('http://localhost:3000/rating', {
        user_id: userId,
        food_id: lunch.id,
        rating: liked,
      });
      console.log('Rating saved');
      setRatingId(response.data.ratingId);
    } catch (error) {
      console.error('Error saving rating:', error);
    }

    if (direction === 'left') {
      console.log('didn\'t like');
      setSwipeClass('swipe-left');
    } else if (direction === 'right') {
      console.log('did like');
      setSwipeClass('swipe-right');
    }
    setTimeout(() => {
      setCurrentIndex((prevIndex) => {
        const newIndex = prevIndex + 1;
        if (newIndex >= todayLunches.length) {
          setShowAdditionalQuestions(true);
        }
        return newIndex;
      });
      setSwipeClass('');
    }, 800); // Match the duration of the swipe animations
  };

  const onCardLeftScreen = (myIdentifier) => {
    console.log(myIdentifier + ' left the screen');
  };

  const getCurrentDayName = () => {
    const days = ['Neděle', 'Pondělí', 'Úterý', 'Středa', 'Čtvrtek', 'Pátek', 'Sobota'];
    const today = new Date();
    return days[today.getDay()];
  };

  const handleLoginSuccess = (userId) => {
    setIsLoggedIn(true);
    setUserId(userId);
  };

  const handleLunchSelection = (lunchNumber) => {
    setSelectedLunch(lunchNumber);
    setTodayLunches(todayLunches.filter(lunch => lunch.lunchNumber.includes(lunchNumber.toString())));
  };

  const handleAdditionalQuestionsSubmit = async (ratings) => {
    try {
      await axios.post('http://localhost:3000/additionalQuestions', {
        user_id: userId,
        ...ratings,
      });
      console.log('Additional questions saved');
    } catch (error) {
      console.error('Error saving additional questions:', error);
    }
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
          <Nav className="justify-content-center align-items-center">
            <Nav.Link as={Link} to="/week" className="text-light">
              Obědy tento týden
            </Nav.Link>
            {/* <Nav.Link href="#about" className="text-light">O nás</Nav.Link> */}
            {/* <Nav.Link href="#services" className="text-light">Login/Profil</Nav.Link> */}
          </Nav>
        </Container>
      </Navbar>

      <div className="main-content">
        <Routes>
          <Route path="/login" element={!isLoggedIn ? <Login onLoginSuccess={handleLoginSuccess} /> : <Navigate to="/" />} />
          <Route path="/" element={
            isLoggedIn ? (
              <div className="d-flex justify-content-center align-items-center vh-100 flex-column mt-5">
                {!loading && isWeekend && (
                  <h1 className='mb-5 info-heading'>
                    O víkendu nejsou žádné obědy
                  </h1>
                )}

                {!loading && !isWeekend && todayLunches.length > 0 && !selectedLunch && (
                  <div className="lunch-selection d-flex justify-content-center align-items-center flex-column">
                    <h1 className='mb-5 info-heading'>
                      Který oběd jste měl/a?
                    </h1>
                    {todayLunches.map((lunch, index) => (
                      <button
                        key={index}
                        className="btn bg-yellow m-2 lunch-choice"
                        onClick={() => handleLunchSelection(lunch.lunchNumber)}
                      >
                        {lunch.lunchDescription}
                      </button>
                    ))}
                  </div>
                )}

                {!loading && !isWeekend && todayLunches.length > 0 && selectedLunch && currentIndex < todayLunches.length && (
                  <h1 className='mb-5 info-heading'>
                    Swipuj jako na tinderu!
                  </h1>
                )}

                {!loading && (
                  <h2 className='mb-5 info-day'>
                    {getCurrentDayName()}
                  </h2>
                )}

                {loading ? (
                  <Spinner animation="border" role="status" size="lg" variant="danger">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                ) : !isWeekend && todayLunches.length > 0 && selectedLunch && currentIndex < todayLunches.length ? (
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
                  showAdditionalQuestions && <AdditionalQuestions onSubmit={handleAdditionalQuestionsSubmit} ratingId={ratingId} />
                )}
              </div>
            ) : (
              <Navigate to="/login" />
            )
          } />
          <Route path="/week" element={<Menu />} />
        </Routes>
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