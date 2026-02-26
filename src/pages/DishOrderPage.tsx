import React, { useEffect, useState } from "react";

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
}

export default function DishOrderPage() {
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [quantities, setQuantities] = useState<{ [key: number]: number }>({});
  const [message, setMessage] = useState("");

  // ==========================
  // API: lấy danh sách món
  // ==========================
  const findAllDish = async () => {
    const res = await fetch(`https://expressbackend-production-032e.up.railway.app/dish/findAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      throw new Error("Không thể tải danh sách món ăn");
    }

    return await res.json();
  };

  // ==========================
  // API: gửi order
  // ==========================
  const dishOrder = async (data: any) => {
    const res = await fetch(`https://expressbackend-production-032e.up.railway.app/dishOrder/order`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify(data),
    });

    return res;
  };

  // ==========================
  // Load dữ liệu khi mount
  // ==========================
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await findAllDish();
        setDishes(data);
      } catch (err: any) {
        setMessage(err.message);
      }
    };

    loadData();
  }, []);

  // ==========================
  // Xử lý thay đổi số lượng
  // ==========================
  const handleQuantityChange = (id: number, value: number) => {
    setQuantities({
      ...quantities,
      [id]: value,
    });
  };

  // ==========================
  // Gửi order
  // ==========================
  const handleOrder = async () => {
    try {
      // lọc các món có quantity > 0
      const orderData = dishes
        .filter((dish) => quantities[dish.id] > 0)
        .map((dish) => ({
          id: dish.id,
          quantity: quantities[dish.id],
        }));

      if (orderData.length === 0) {
        setMessage("Vui lòng nhập số lượng ít nhất một món");
        return;
      }

      const res = await dishOrder(orderData);

      if (!res.ok) {
        const errorText = await res.text();
        throw new Error(errorText);
      }

      setMessage("Đặt món thành công!");
    } catch (err: any) {
      setMessage("Lỗi: " + err.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <h2>Danh sách món ăn</h2>

      {message && <p style={{ color: "red" }}>{message}</p>}

      <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
        {dishes.map((dish) => (
          <div
            key={dish.id}
            style={{
              border: "1px solid #ccc",
              padding: "10px",
              width: "200px",
            }}
          >
            <img
              src={"http://localhost:3000"+dish.image}
              alt={dish.name}
              style={{ width: "100%", height: "150px", objectFit: "cover" }}
            />
            <h4>{dish.name}</h4>
            <p>Giá: {dish.price} VND</p>

            <input
              type="number"
              min="0"
              placeholder="Số lượng"
              value={quantities[dish.id] || ""}
              onChange={(e) =>
                handleQuantityChange(dish.id, Number(e.target.value))
              }
              style={{ width: "100%" }}
            />
          </div>
        ))}
      </div>

      <button
        onClick={handleOrder}
        style={{
          marginTop: "20px",
          padding: "10px 20px",
          cursor: "pointer",
        }}
      >
        Đặt món
      </button>
    </div>
  );
}