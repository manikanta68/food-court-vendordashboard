import  { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import "./index.css";

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("jwtToken"); 
        if (token) {
          navigate("/");
        }
  },[])

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const data = await response.json();
        setMessage("Login successful!");
        console.log(data)
        Cookies.set("jwtToken", data.jwtToken, { expires: 1, secure: true });
        Cookies.set("username", formData.username, { expires: 1, secure: true });
        navigate("/")
      } else {
        const errorData = await response.text();
        setMessage(errorData);
      }
    } catch (error) {
      setMessage("An error occurred. Please try again.");
    }
  };

  return (
    <div className="login-bg-container">
    <div className="login-container">
      <h2>Login</h2>
      <form onSubmit={handleSubmit} className="login-form">
        <label>
          Username:
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <p className="message">
        {message}
      </p>
      <p className="register-link">
        Don’t have an account? <button onClick={() => navigate("/register")}>Register Here</button>
      </p>
    </div>
    </div>
  );
};

export default Login;
