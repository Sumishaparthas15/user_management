import React from 'react';
import { useNavigate } from 'react-router-dom';

function Home() {
    const navigate = useNavigate();
  return (
    <div>
      <h1>Home</h1>
      <button onClick={() => navigate('/login')}>Sign In</button>
      <button onClick={() => navigate('/register')}>Sign Up</button>
      <button>just for checking</button>
    </div>
  )
}

export default Home