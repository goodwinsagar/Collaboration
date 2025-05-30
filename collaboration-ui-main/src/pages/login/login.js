import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "./login.css";
import { ReactComponent as Logo } from "../../assets/logo.svg";
import utils from "../../utils";
import api from "../../api/apiCalls";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (event) => {
    event.preventDefault(); // Prevent the form from refreshing the page

    const userData = {
      email,
      password,
    };
    try {
      const response = await api.loginUser(userData);
      const { token, user } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(user));
      window.open(utils.constants.path.story, "_self");
    } catch (error) {
      if (error.response && error.response.status === 401) {
        toast.error("Incorrect Email or Password.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  return (
    <div className="login-container d-flex flex-column">
      <div className="container mt-3 ">
        <div className="row">
          <div className="col">
            <Logo />
          </div>
        </div>
      </div>
      <div className="d-flex flex-column justify-content-center align-items-center ">
        {/* Text "collaborative" outside the form, centered above it */}
        <h1 className="collaborative-text mb-4">Collaborative</h1>
        <div className="login-form text-center">
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <input
                type="email"
                className="form-control"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="form-group mt-4">
              <input
                type="password"
                className="form-control"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="d-flex flex-column mt-5 justify-content-center align-items-center">
              <div className="w-50 ">
                <button
                  type="submit"
                  className="btn btn-dark btn-block px-5 mt-4"
                >
                  Login
                </button>
              </div>
            </div>
            <p className="signup-text mt-4">
              Don't have account? <a href="/register">Create Account</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
