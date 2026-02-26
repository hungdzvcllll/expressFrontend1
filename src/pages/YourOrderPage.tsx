import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface Order {
  id: number;
  amount: number;
  status: string;
}

const YourOrderPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");
  const navigate=useNavigate()
  // =============================
  // API: Lấy danh sách order
  // =============================
  const findYourOrder = async () => {
    const res = await fetch(
      "https://expressbackend-production-032e.up.railway.app/dishOrder/findYourOrder",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );
    return res;
  };

  // =============================
  // API: Hủy order
  // =============================
  const cancelOrder = async (id: number) => {
    const res = await fetch(
      `https://expressbackend-production-032e.up.railway.app/dishOrder/cancel/${id}`,
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

  // =============================
  // Load orders khi mount
  // =============================
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const response = await findYourOrder();

        if (!response.ok) {
          const errText = await response.text();
          throw new Error(errText);
        }

        const data = await response.json();
        setOrders(data);
      } catch (err: any) {
        setError(err.message || "Có lỗi xảy ra");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // =============================
  // Xử lý hủy order
  // =============================
  const handleCancel = async (id: number) => {
    const confirmCancel = window.confirm("Bạn có chắc muốn hủy order này?");
    if (!confirmCancel) return;

    try {
      const response = await cancelOrder(id);

      if (!response.ok) {
        const errText = await response.text();
        throw new Error(errText);
      }

      // Cập nhật lại danh sách (cách 1: gọi lại API)
      setOrders((prev) =>
        prev.map((order) =>
          order.id === id ? { ...order, status: "CANCELLED" } : order
        )
      );

      alert("Hủy order thành công!");
    } catch (err: any) {
      alert(err.message || "Không thể hủy order");
    }
  };

  // =============================
  // Render
  // =============================
  if (loading) return <h2>Đang tải dữ liệu...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Danh sách Order của bạn</h1>

      {orders.length === 0 ? (
        <p>Bạn chưa có order nào.</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Số tiền</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{order.amount}</td>
                <td>{order.status}</td>
                <td>
                  {order.status !== "CANCELLED" && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        padding: "5px 10px",
                        border: "none",
                        cursor: "pointer",
                      }}
                    >
                      Hủy
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
      )}
    </div>
  );
};

export default YourOrderPage;