import React, { useState } from "react";
import "../styles/Register.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("borrower");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post(
        "http://localhost:3005/api/auth/register",
        {
          name,
          email,
          password,
          role,
        }
      );
      setSuccess("Account created successfully! Redirecting to login...");

      setTimeout(() => navigate("/"), 2000);
    } catch (error) {
      setError(
        error.response?.data?.message ||
          "Registration failed. Please try again."
      );
      console.log(error.message);
    }
  };

  return (
    <div className="main_container">
      <section className="register_container">
        {error && <div className="toast-error">{error}</div>}
        {success && <div className="toast-success">{success}</div>}

        <div className="register_form_container">
          <div className="title">
            <h2>Create Your Account</h2>
            <h3>Lorem ipsum dolor sit amet consectetur adipisi</h3>
          </div>

          <form className="register_input_container" onSubmit={handleRegister}>
            <div className="name_div">
              <label htmlFor="name">Name</label>
              <input
                type="text"
                required
                id="name"
                placeholder="Enter name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value);
                }}
              />
            </div>

            <div className="email_div">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                required
                placeholder="Enter email"
                id="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </div>

            <div className="password_div">
              <label htmlFor="password">Password</label>
              <input
                type="password"
                required
                id="password"
                placeholder="*****"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </div>

            <div className="role_div">
              <label htmlFor="role">Role</label>
              <select
                className="input"
                value={role}
                id="role"
                onChange={(e) => {
                  setRole(e.target.value);
                }}
              >
                <option value="borrower">Borrower</option>
                <option value="librarian">Librarian</option>
              </select>
            </div>

            <button type="submit" className="register_btn">
              create account
            </button>
          </form>

          <p className="info">
            Have an account?
            <span
              onClick={() => {
                navigate("/");
              }}
            >
              {" "}
              Login
            </span>
          </p>
        </div>
      </section>

      <section className="login_bg_container">
        <img src="/images/register_bg.jpg" alt="login-background-image" />
      </section>
    </div>
  );
};

export default Register;
