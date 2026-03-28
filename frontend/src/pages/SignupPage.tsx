import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/global/layout.css";

export default function RegisterPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    organizationName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: ""
  });

  const [agreed, setAgreed] = useState(false);

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    if (!agreed) {
      alert("Please agree to the terms and conditions");
      return;
    }

    const res = await fetch("http://localhost:5000/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name: form.name,
        email: form.email,
        password: form.password,
        organizationName: form.organizationName
      })
    });

    const data = await res.json();

    localStorage.setItem("token", data.token);
    localStorage.setItem("userName", form.name);
    localStorage.setItem("orgName", form.organizationName);

    if (data.user?.organization_id) {
      localStorage.setItem("organization_id", data.user.organization_id);
    }

    navigate("/dashboard");
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="logo">SYNCTEX</h2>
        <h1>Create new account</h1>
        <p>Start managing your organization today</p>

        <form onSubmit={handleSubmit} className="auth-form">

          <div className="form-grid">

            <div>
              <label>Full Name</label>
              <input
                name="name"
                placeholder="Enter your full name"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Organization Name</label>
              <input
                name="organizationName"
                placeholder="Enter organization name"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Email</label>
              <input
                name="email"
                placeholder="Enter email"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Phone</label>
              <input
                name="phone"
                placeholder="Enter phone"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                onChange={handleChange}
              />
            </div>

            <div>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Re-enter password"
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
              Sign up
            </button>
          </div>

          <div className="signin-row">
            Already have an Account? <a href="/login">Sign in</a>
          </div>

        </form>

      </div>

    </div>
  );
}
