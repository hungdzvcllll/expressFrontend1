import { useState } from "react";
import React from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://expressbackend-production-032e.up.railway.app/user/login",
        { username, password }
      );

      localStorage.setItem("token", res.data.token);
      alert("Login success!");
      if(res.data.role==="ADMIN")
      navigate("/adminDashboard")
      if(res.data.role==="USER")
      navigate("/dashboard")
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          placeholder="Username"
          onChange={(e) => setUsername(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit">Login</button>
      </form>

      <Link to="/register">Register</Link>
    </div>
  );
}
