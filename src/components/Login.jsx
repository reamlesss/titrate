import { useState } from 'react';
import './Login.css';

function Login({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    if (email.endsWith('@spsejecna.cz')) {
      console.log('Email:', email);
      console.log('Password:', password);
      setError('');
      onLoginSuccess();
      // Proceed with login
    } else {
      setError('Email must be in the format example@spsejecna.cz');
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100 flex-column login-cont">
      <form onSubmit={handleLogin} className="login-form bg-yellow p-5 rounded-4 fw-bold">
        <div className="mb-3">
          <label htmlFor="email" className="form-label fs-4">Email</label>
          <input
            type="email"
            className="form-control form-control-lg fs-4"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder='titman@spsejecna.cz'
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
          <button type="submit" className="btn btn-primary btn-lg">Login</button>
        </div>
      </form>
    </div>
  );
}

export default Login;