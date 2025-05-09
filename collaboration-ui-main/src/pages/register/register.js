import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./register.css";
import { ReactComponent as BackgroundShape1 } from "../../assets/shape1.svg";
import { ReactComponent as BackgroundShape2 } from "../../assets/shape2.svg";
import { ReactComponent as BackgroundShape3 } from "../../assets/shape3.svg";
import bcrypt from "bcryptjs";
import Axios from "axios";
import { toast } from "react-toastify";
import utils from "../../utils";
import api from "../../api/apiCalls";

const Register = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Hash the password before sending it to the server
    const salt = bcrypt.genSaltSync(10);
    const hashedPassword = bcrypt.hashSync(password, salt);

    const user = {
      name: username,
      email: email,
      password: hashedPassword,
    };

    try {
      const response = await api.registerUser(user);
      const { token, user: userData } = response.data;

      localStorage.setItem("token", token);
      localStorage.setItem("user", JSON.stringify(userData));

      window.open(utils.constants.path.story, "_self");
    } catch (error) {
      if (error.response && error.response.status === 409) {
        toast.error("This email is already taken.");
      } else {
        toast.error("An unexpected error occurred.");
      }
    }
  };
  return (
    <div className="register-container">
      <BackgroundShape1 className="background-shape background-shape1" />
      <BackgroundShape2 className="background-shape background-shape2" />
      <BackgroundShape3 className="background-shape background-shape3" />

      <a href="/" className="btn back-button">
        Back
      </a>
      <h1 className="text-center mb-4 title-text">
        Power your Story with <span className="colab">Collaborative</span>
      </h1>
      <div className="form-container mt-4">
        <form onSubmit={handleSubmit}>
          <div className="form-group mt-4">
            <input
              type="text"
              className="form-control"
              placeholder="Name"
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <input
              type="email"
              className="form-control"
              placeholder="Email"
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group mt-4">
            <input
              type="password"
              className="form-control"
              placeholder="Password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="d-flex flex-column mt-5 justify-content-center align-items-center">
            <div className="mt-3 w-75">
              <button
                type="submit"
                className="btn btn-dark btn-block px-5 mt-4"
              >
                Create Account
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register;
