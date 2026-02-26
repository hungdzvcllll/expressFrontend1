import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import React from "react";
export default function ConfirmRegister() {
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");

  const handleConfirm = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "https://expressbackend-production-032e.up.railway.app/user/confirmRegister",
        { username, code }
      );
      alert("Confirm success!");
      navigate("/");
    } catch (err) {
      alert("Confirm failed");
    }
  };

  return (
    <div>
      <h2>Confirm Register</h2>
      <form onSubmit={handleConfirm}>
        <input placeholder="Username" onChange={(e) => setUsername(e.target.value)} />
        <input placeholder="Code" onChange={(e) => setCode(e.target.value)} />
        <button type="submit">Confirm</button>
      </form>
    </div>
  );
}
