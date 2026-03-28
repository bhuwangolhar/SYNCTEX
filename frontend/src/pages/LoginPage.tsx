import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../components/global/layout.css";

export default function LoginPage() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: ""
  });

  const handleChange = (e: any) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        email: form.email,
        password: form.password
      })
    });

    const data = await res.json();

    if (data.token) {
      localStorage.setItem("token", data.token);
      localStorage.setItem("userName", data.user?.name || "Welcome back");

      if (data.user?.organization_id) {
        localStorage.setItem("organization_id", data.user.organization_id);
      }

      navigate("/dashboard");
    } else {
      alert(data.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="logo">SYNCTEX</h2>
        <h1>Welcome Back</h1>
        <p>Continue to manage your existing organization</p>

        <form onSubmit={handleSubmit}>

          <div className="form-group">
            <label>Email</label>
            <input
              name="email"
              type="email"
              placeholder="Enter your email"
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              name="password"
              type="password"
              placeholder="Enter your password"
              onChange={handleChange}
            />
          </div>

          <div className="submit-btn-wrapper">
            <button type="submit" className="submit-btn">
              Login
            </button>
          </div>

          <div className="signup-row">
            Don't have an account? <a href="/signup">Create new account</a>
          </div>

        </form>

      </div>

    </div>
  );
}
