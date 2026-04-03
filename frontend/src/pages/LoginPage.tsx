// Login Page

// frontend/src/pages/LoginPage.tsx

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/global/layout.css';
import { apiUrl, parseApiResponse } from '../services/api';

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(apiUrl('/auth/login'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: form.email, password: form.password })
      });

      const data = await parseApiResponse<any>(res, 'Login failed');

      if (!data?.token) {
        setError('Login failed');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user?.name || '');
      localStorage.setItem('userRole', data.user?.role || '');
      // Keep for display only — auth decisions always use the JWT server-side
      if (data.user?.organization_id) {
        localStorage.setItem('organization_id', data.user.organization_id);
        localStorage.setItem('orgName', data.user?.organization_name || '');
      }

      navigate('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Network error. Please try again.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="logo">SYNCTEX</h2>
        <h1>Welcome back</h1>
        <p>Sign in to your organization account</p>

        {error && (
          <div className="auth-error" style={{ color: '#ef4444', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              required
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              required
              onChange={handleChange}
            />
          </div>

          <div className="submit-btn-wrapper">
            <button type="submit" className="submit-btn">
              Sign in
            </button>
          </div>

          <div className="signup-row" style={{ fontSize: 13, color: '#64748b', textAlign: 'center', marginTop: 16 }}>
            Setting up a new organization?{' '}
            <a href="/signup">Create workspace</a>
          </div>

          <p style={{ fontSize: 12, color: '#94a3b8', textAlign: 'center', marginTop: 8 }}>
            New team member? Your admin will create your account and share credentials with you.
          </p>
        </form>
      </div>
    </div>
  );
}
