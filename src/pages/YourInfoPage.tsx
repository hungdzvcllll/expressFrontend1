import React, { useEffect, useState } from "react";

interface UserInfo {
  username: string;
  role: string;
  phone: string;
  email: string;
}

export default function YourInfoPage() {
  const [user, setUser] = useState<UserInfo | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const yourInfo = async () => {
    try {
      const res = await fetch("https://expressbackend-production-032e.up.railway.app/user/yourInfo", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text);
      }

      const data = await res.json();
      setUser(data);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    yourInfo();
  }, []);

  if (loading) return <h2>Đang tải thông tin...</h2>;

  if (error) return <h2 style={{ color: "red" }}>Lỗi: {error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Thông tin cá nhân</h1>

      {user && (
        <div
          style={{
            border: "1px solid #ccc",
            padding: "20px",
            borderRadius: "10px",
            width: "400px",
          }}
        >
          <p><strong>Tên:</strong> {user.username}</p>
          <p><strong>Vai trò:</strong> {user.role}</p>
          <p><strong>Số điện thoại:</strong> {user.phone}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      )}
    </div>
  );
}