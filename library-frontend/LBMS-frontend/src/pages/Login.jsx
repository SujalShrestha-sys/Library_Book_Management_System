import axios from "axios";
import React, { useEffect } from "react";
import { useState } from "react";
import "../styles/login.css";
import { useNavigate } from "react-router-dom";
import { CiLogin } from "react-icons/ci";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    if (error) {
      const ErrorDisplayTIme = setTimeout(() => setError(""), 3000);

      return () => {
        clearTimeout(ErrorDisplayTIme);
      };
    }
  }, [error]);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3005/api/auth/login",
        {
          email,
          password,
        }
      );

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("user", JSON.stringify(response?.data.user));

      if (response.data.user.role === "librarian") {
        navigate("/dashboard");
      } else {
        navigate("/dashboard");
      }
    } catch (error) {
      setError(
        error.response?.data?.message || "Login failed. Please try again."
      );
      console.error("Login error:", error);
    }
  };
  return (
    <div>
      {error && <div className="toast-error">{error}</div>}
      <section className="main-frame">
        <div className="login_img">
          <img src="/images/login_Image.jpg" alt="login background" />
        </div>
        <div className="login_form">
          <div className="title_container">
            <h2>Welcome to Bookaman</h2>
            <h3 className="text">
              sign in <CiLogin className="login_icon" />
            </h3>
          </div>

          <form onSubmit={handleLogin} className="form_container">
            <div className="email">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                required
                placeholder="Enter email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="password">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                id="password"
                required
                placeholder="*****"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <button className="login_btn">Login</button>

            <div className="lines_Container">
              <div className="lines"></div>
              <span>OR</span>
              <div className="lines"></div>
            </div>

            <div className="social_medias">
              <div className="google">
                <img src="/images/google.png" alt="google" />
              </div>
              <div className="google">
                <img src="/images/facebook.png" alt="facebook" />
              </div>
              <div className="apple">
                <img src="/images/apple.png" alt="apple" />
              </div>
            </div>

            <div className="signup_info">
              <p>
                Do you have an account?{" "}
                <span
                  onClick={() => {
                    navigate("/register");
                  }}
                >
                  Sign up
                </span>{" "}
                here.
              </p>
            </div>
          </form>
        </div>
      </section>
    </div>
  );
};

export default Login;
