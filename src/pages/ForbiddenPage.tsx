import React from "react";
import { useNavigate } from "react-router-dom";

const ForbiddenPage: React.FC = () => {
  const navigate = useNavigate();

  const role = localStorage.getItem("role"); 
  // giả sử bạn lưu role khi login

  const handleGoBack = () => {
    if (role === "ADMIN") {
      navigate("/adminDashboard");
    } else if (role === "USER") {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={styles.code}>403</h1>
        <h2 style={styles.title}>Access Denied</h2>
        <p style={styles.message}>
          Bạn không có quyền truy cập vào trang này.
        </p>

        <button style={styles.button} onClick={handleGoBack}>
          Quay về trang chính
        </button>
      </div>
    </div>
  );
};

const styles: { [key: string]: React.CSSProperties } = {
  container: {
    height: "100vh",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    background: "linear-gradient(135deg, #667eea, #764ba2)",
  },
  card: {
    background: "white",
    padding: "50px",
    borderRadius: "16px",
    textAlign: "center",
    boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
    width: "400px",
  },
  code: {
    fontSize: "72px",
    margin: 0,
    color: "#ff4d4f",
  },
  title: {
    margin: "10px 0",
  },
  message: {
    color: "#666",
    marginBottom: "20px",
  },
  button: {
    padding: "10px 20px",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#667eea",
    color: "white",
    fontWeight: "bold",
  },
};

export default ForbiddenPage;