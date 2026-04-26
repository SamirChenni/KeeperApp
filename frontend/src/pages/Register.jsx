import { useState } from "react";
import { Mail, KeyRound, Eye, EyeOff, User } from "lucide-react";
import { Link } from "react-router-dom";
import axios from "axios";
import Keeper from "../assets/keeper.png";
import { useNavigate } from "react-router-dom"; // Add this to your imports

function Register() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  function handleChange(e) {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();

    // 1. Using relative path thanks to your Vite Proxy
    // 2. Sending the formData (which has 'email', 'name', and 'password')
    axios
      .post("/register", formData, {
        withCredentials: true,
      })
      .then((res) => {
        // 3. Automatically send the user to the Dashboard
        navigate("/dashboard");
      })
      .catch((err) => {
        console.log("Error:", err.response?.data || err.message);
        // Optional: Add a simple alert so you know if registration failed
        alert(err.response?.data?.message || "Registration failed!");
      });
  }
  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={Keeper} alt="Keeper Logo" className="login-logo" />
          <h1>Create Account</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <User className="input-icon" size={20} />
            <input
              type="text"
              name="name"
              onChange={handleChange}
              placeholder="Full Name"
              required
            />
          </div>

          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              required
            />
          </div>

          <div className="input-group">
            <KeyRound className="input-icon" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              name="password"
              onChange={handleChange}
              required
            />
            <span
              className="eye-icon"
              onClick={() => setShowPassword(!showPassword)}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>

          <button type="submit" className="login-btn">
            Sign Up
          </button>
        </form>
        <div className="separator">
          <span>OR</span>
        </div>
        <a href="http://localhost:3000/auth/google" className="noline">
          <button className="google-btn">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/3840px-Google_%22G%22_logo.svg.png"
              alt="Google Logo"
            />
            Sign up with Google
          </button>
        </a>
        <p className="signup-link">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
