import Navbar from 'react-bootstrap/Navbar'
import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav'
import logo from './assets/logo.png'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  return (
    <>
   <Navbar className="bg-red fixed-top w-100 text-light">
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
            <Nav.Link href="#services" className="text-light">Služby</Nav.Link>
            <Nav.Link href="#contact" className="text-light">Kontakt</Nav.Link>
          </Nav>
        </Container>
      </Navbar>

      
      <div className="d-flex justify-content-center align-items-center vh-100 flex-column mt-5"></div>
    </>
  )
}

export default App;