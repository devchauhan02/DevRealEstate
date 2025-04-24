import React, { useState } from 'react';
import { sendPasswordResetEmail, getAuth } from 'firebase/auth';
import { app } from '../firebase';
import { useNavigate } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setMessage('');
    const auth = getAuth(app);

    try {
      await sendPasswordResetEmail(auth, email);
      setMessage('Password reset email sent! Check your inbox.');
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="mt-20 flex items-center justify-center px-4">
      <div className="w-full max-w-md  bg-white">
        <h1 className="text-2xl font-bold mb-4">Forgot password?</h1>
        <p className='text-sm mb-7'>No Problem! Enter your email or username below and we will send you an email with instructions to reset your password.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {message && <p className="text-green-600 text-sm text-center">{message}</p>}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          <input
            type="email"
            placeholder="Enter your email"
            className="w-full border p-2 rounded-md"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <button className="w-full bg-green-700 text-white font-semibold py-2 rounded-md cursor-pointer hover:bg-green-800" type="submit">
            Send reset link
          </button>
        </form>

        <p className="text-center mt-4 text-sm">
          Back to {' '}
          <button
            type="button"
            onClick={() => navigate('/signin')}
            className="text-blue-600 font-semibold cursor-pointer text-sm"
          >
            Sign In
          </button>
        </p>
      </div>
    </div>
  );
};

export default ForgotPassword;
