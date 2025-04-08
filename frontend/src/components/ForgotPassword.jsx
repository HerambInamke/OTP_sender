import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    try {
      const response = await axios.post('https://otpsender-production.up.railway.app/api/auth/forgot-password', { email });
      setMessageType('success');
      setMessage(response.data.message);
      
      // Save email in sessionStorage to pass to the reset page
      sessionStorage.setItem('resetEmail', email);
      
      // Redirect to reset password page
      setTimeout(() => {
        navigate('/reset-password');
      }, 2000);
      
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Failed to send OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Forgot Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            placeholder="Enter your email"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Sending...' : 'Send OTP'}
        </button>
      </form>
      
      {message && <div className={`message ${messageType}`}>{message}</div>}
      
      <Link to="/login" className="link">
        Back to Login
      </Link>
    </div>
  );
}

export default ForgotPassword;
