import { useState } from "react";
import { Mail, KeyRound, Eye, EyeOff } from "lucide-react";
import { Link, useNavigate } from "react-router-dom"; // 1. Import useNavigate
import axios from "axios"; // 2. Import axios
import Keeper from "../assets/keeper.png";

function Login() {
  const navigate = useNavigate(); // 3. Initialize navigate
  const [showPassword, setShowPassword] = useState(false);
  // 4. State for form data
  const [credentials, setCredentials] = useState({
    email: "",
    password: "",
  });
  const [error , setError] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
    if (error) setError(false);
  }

  function togglePasswordVisibility() {
    setShowPassword((prev) => !prev);
  }

  // 5. Submit Logic
  function handleSubmit(e) {
    e.preventDefault();

    axios
      .post(
        "/login",
        {
          username: credentials.email, // Passport looks for 'username'
          password: credentials.password,
        },
        { withCredentials: true },
      )
      .then((res) => {
        navigate("/dashboard"); // 6. Redirect on success
      })
      .catch((err) => {
        setError(true);
      });
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <img src={Keeper} alt="Keeper Logo" className="login-logo" />
          <h1>Welcome back</h1>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-group">
            <Mail className="input-icon" size={20} />
            <input
              type="email"
              name="email" // Added name
              placeholder="Email Address"
              onChange={handleChange} // Added handler
              value={credentials.email}
              required
            />
          </div>

          <div className="input-group">
            <KeyRound className="input-icon" size={20} />
            <input
              type={showPassword ? "text" : "password"}
              name="password" // Added name
              placeholder="Password"
              onChange={handleChange} // Added handler
              value={credentials.password}
              required
            />
            <span
              className="eye-icon"
              onClick={togglePasswordVisibility}
              style={{ cursor: "pointer" }}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </span>
          </div>
          {error && (<div className="error-message" >
            <p style={{ color: "red", fontSize: "12px" }}>Invalid email or password!</p>
          </div>)}
          <div className="form-options">
            <a href="#forgot" className="forgot-password">
              Forgot Password?
            </a>
          </div>

          <button type="submit" className="login-btn">
            Sign In
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
            Sign in with Google
          </button>
        </a>

        <p className="signup-link">
          Don't have an account? <Link to="/register">Sign Up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
