import React, { useState } from "react";

const AddDishPage = () => {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!name || !price || !image) {
      setMessage("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", name);
      formData.append("price", price);
      formData.append("image", image);

      const res = await fetch("https://expressbackend-production-032e.up.railway.app/dish/add", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + localStorage.getItem("token"),
          // ❌ KHÔNG thêm Content-Type ở đây
        },
        body: formData,
      });

      if (res.ok) {
        setMessage("Thêm món ăn thành công!");
        setName("");
        setPrice("");
        setImage(null);
      } else {
        const errorText = await res.text();
        setMessage("Lỗi: " + errorText);
      }
    } catch (err) {
      setMessage("Có lỗi xảy ra!");
      console.error(err);
    }
  };

  return (
    <div style={{ padding: "30px" }}>
      <h2>Thêm món ăn</h2>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: "15px" }}>
          <label>Tên món:</label><br />
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Giá:</label><br />
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: "15px" }}>
          <label>Hình ảnh:</label><br />
          <input
            type="file"
            onChange={(e) =>
            {if (e.target.files && e.target.files.length > 0)  setImage(e.target.files[0])}}
          />
        </div>

        <button type="submit">Thêm món</button>
      </form>

      {message && <p style={{ marginTop: "20px" }}>{message}</p>}
    </div>
  );
};

export default AddDishPage;