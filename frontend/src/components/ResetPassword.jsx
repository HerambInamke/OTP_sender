import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

function ResetPassword() {
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messageType, setMessageType] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    // Get email from sessionStorage that was set on the forgot password page
    const savedEmail = sessionStorage.getItem('resetEmail');
    if (!savedEmail) {
      // Redirect back to forgot password if email isn't found
      navigate('/forgot-password');
    } else {
      setEmail(savedEmail);
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    
    // Validate passwords match
    if (newPassword !== confirmPassword) {
      setMessageType('error');
      setMessage('Passwords do not match.');
      setIsLoading(false);
      return;
    }
    
    try {
      const response = await axios.post('http://localhost:5000/api/auth/reset-password', {
        email,
        otp,
        newPassword
      });
      
      setMessageType('success');
      setMessage(response.data.message);
      
      // Clear sessionStorage
      sessionStorage.removeItem('resetEmail');
      
      // Redirect to login after successful reset
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
    } catch (error) {
      setMessageType('error');
      setMessage(error.response?.data?.message || 'Failed to reset password. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <h2>Reset Password</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <input
            type="email"
            id="email"
            value={email}
            disabled
            readOnly
          />
        </div>
        <div className="form-group">
          <label htmlFor="otp">Enter 6-digit OTP sent to your email (check in the spam)</label>
          <input
            type="text"
            id="otp"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            required
            placeholder="6-digit OTP"
            maxLength="6"
            pattern="\d{6}"
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            type="password"
            id="newPassword"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            placeholder="Enter new password"
            minLength="8"
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            placeholder="Confirm new password"
            minLength="8"
          />
        </div>
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Processing...' : 'Reset Password'}
        </button>
      </form>
      
      {message && <div className={`message ${messageType}`}>{message}</div>}
      
      <Link to="/forgot-password" className="link">
        Request New OTP
      </Link>
    </div>
  );
}

export default ResetPassword;
