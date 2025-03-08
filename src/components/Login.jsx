import { useState } from 'react';
import axios from 'axios';
import Spinner from 'react-bootstrap/Spinner';
import './Login.css';


//  async function test() {

//    let username = 'vondracek';
//     const userIdResponse = await axios.get(`http://localhost:3000/user/${username}`);
//     const userId = userIdResponse.data.userId;
//     console.log(userId);
  
// }

function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:3000/login', {
        username,
        password,
      });
      if (response.data.success) {
        setError('');
        const userIdResponse = await axios.get(`http://localhost:3000/user/${username}`);
        const userId = userIdResponse.data.userId;
        console.log(userId);
        localStorage.setItem('userId', userId);
        onLoginSuccess();
      } else {
        setError('Invalid username or password');
      }
    } catch (error) {
      console.error('Error during login:', error);
      if (error.response && error.response.status === 500 && error.response.data === "Jidelna website is currently experiencing issues. Please try again later.") {
        setError('Jidelna website is currently experiencing issues. Please try again later.');
      } else {
        setError('An error occurred during login');
      }
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column login-cont">
      <form onSubmit={handleLogin} className="login-form bg-yellow  p-5 rounded-4 fw-bold">
        <div className="mb-3">
          <label htmlFor="username" className="form-label fs-4">Username</label>
          <input
            type="text"
            className="form-control form-control-lg fs-4"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder='titman'
            required
          />
        </div>
        <div className="mb-3">
          <label htmlFor="password" className="form-label fs-4">Password</label>
          <input
            type="password"
            className="form-control form-control-lg fs-4"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder='••••••••'
            required
          />
        </div>
        {error && <div className="text-danger mb-3">{error}</div>}
        <div className="d-flex justify-content-center">
          <button type="submit" className={`btn btn-lg ${loading ? 'btn-loading' : 'btn-primary'}`} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" variant="light" /> : 'Login'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default Login;