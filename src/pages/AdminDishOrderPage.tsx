import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface DishOrder {
  id: number;
  status: string;
  amount: number;
  userId: number;
  username: string;
}

const AdminDishOrderPage: React.FC = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState<DishOrder[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // ===============================
  // API CALLS
  // ===============================

  const findAllDishOrder = async () => {
    const res = await fetch(`https://expressbackend-production-032e.up.railway.app/dishOrder/findAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    const data = await res.json();
    return data;
  };

  const dishOrderSuccess = async (id: number) => {
    const res = await fetch(
      `https://expressbackend-production-032e.up.railway.app/dishOrder/success/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    return res;
  };

  // ===============================
  // LOAD DATA
  // ===============================

  const loadOrders = async () => {
    try {
      const data = await findAllDishOrder();
      setOrders(data);
    } catch (error) {
      console.error("Lỗi khi load order:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ===============================
  // HANDLE SUCCESS
  // ===============================

  const handleSuccess = async (id: number) => {
    try {
      const res = await dishOrderSuccess(id);
      if (res.ok) {
        alert("Cập nhật thành công!");
        loadOrders(); // reload lại danh sách
      } else {
        alert("Cập nhật thất bại!");
      }
    } catch (error) {
      console.error(error);
    }
  };

  // ===============================
  // RENDER
  // ===============================

  if (loading) return <h2>Đang tải dữ liệu...</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý Dish Order</h2>

      <table
        border={1}
        cellPadding={10}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>ID</th>
            <th>Status</th>
            <th>Amount</th>
            <th>User ID</th>
            <th>Username</th>
            <th>Action</th>
            <th>Xem chi tiết</th>
          </tr>
        </thead>

        <tbody>
          {orders.map((order) => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{order.status}</td>
              <td>{order.amount}</td>
              <td>{order.userId}</td>
              <td>{order.username}</td>
              <td>
                {order.status !== "SUCCESS" &&order.status!=="CANCEL"&& (
                  <button
                    onClick={() => handleSuccess(order.id)}
                    style={{
                      backgroundColor: "green",
                      color: "white",
                      border: "none",
                      padding: "6px 12px",
                      cursor: "pointer",
                    }}
                  >
                    Set Success
                  </button>
                )}
              </td>
              <td>
                  {(
      <button
        onClick={() => navigate(`/dishOrderDetails/${order.id}`)}
      >
        Xem chi tiết
      </button>
    )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDishOrderPage;