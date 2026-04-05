// Signup Page

// frontend/src/pages/SignupPage.tsx
// This page is for creating a NEW ORGANIZATION only.
// Existing employees must be added by their admin from inside the dashboard.

import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../components/global/layout.css';
import { apiUrl, parseApiResponse } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: '',
    organizationName: '',
    email: '',
    mobile: '',
    password: '',
    confirmPassword: ''
  });

  const [agreed, setAgreed] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!agreed) {
      setError('Please agree to the terms and conditions');
      return;
    }

    try {
      const res = await fetch(apiUrl('/auth/register'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          organizationName: form.organizationName,
          mobile: form.mobile
        })
      });

      const data = await parseApiResponse<any>(res, 'Registration failed');

      localStorage.setItem('token', data.token);
      localStorage.setItem('userName', data.user?.name || form.name);
      localStorage.setItem('userRole', data.user?.role || 'ADMIN');
      localStorage.setItem('orgName', data.user?.organization_name || form.organizationName);
      // Keep organization_id in localStorage only for display, NOT for auth decisions
      if (data.user?.organization_id) {
        localStorage.setItem('organization_id', data.user.organization_id);
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
        <h1>Create your organization</h1>
        <p>
          Set up a new workspace. You'll become the admin and can add your
          team from inside the dashboard.
        </p>

        {error && (
          <div className="auth-error" style={{ color: '#ef4444', marginBottom: 12 }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-grid">
            <div>
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Your full name"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Organization Name</label>
              <input
                name="organizationName"
                placeholder="Your company or team name"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                type="email"
                placeholder="you@company.com"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Mobile</label>
              <input
                name="mobile"
                type="tel"
                placeholder="+91 98765 43210"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Choose a password"
                required
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
                required
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="terms-row">
            <input
              type="checkbox"
              id="terms"
              checked={agreed}
              onChange={(e) => setAgreed(e.target.checked)}
            />
            <label htmlFor="terms">
              I agree with all <a href="/terms">terms and conditions</a>
            </label>
          </div>

          <div className="submit-btn-wrapper">
            <button type="submit" className="submit-btn">
              Create organization
            </button>
          </div>

          <div className="signin-row">
            Already have an account? <a href="/login">Sign in</a>
          </div>
          
        </form>
      </div>
    </div>
  );
}
