import React, { useEffect, useState } from "react";

interface TableOrder {
  id: number;
  start: string;
  end: string;
  status: string; 
}

export default function YourTableOrderPage() {
  const [orders, setOrders] = useState<TableOrder[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ==============================
  // API CALL
  // ==============================

  const findYourTableOrder = async () => {
    const res = await fetch(
      "https://expressbackend-production-032e.up.railway.app/tableOrder/findYourOrder",
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

  const cancelTableOrder = async (id: number) => {
    const res = await fetch(
      `https://expressbackend-production-032e.up.railway.app/tableOrder/cancel/${id}`,
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

  // ==============================
  // LOAD DATA
  // ==============================

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError("");

      const response = await findYourTableOrder();

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      setError(err.message || "Có lỗi xảy ra");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  // ==============================
  // HANDLE CANCEL
  // ==============================

  const handleCancel = async (id: number) => {
    if (!window.confirm("Bạn có chắc muốn hủy đặt bàn này?")) return;

    try {
      const response = await cancelTableOrder(id);

      if (!response.ok) {
        const text = await response.text();
        throw new Error(text);
      }

      alert("Hủy đặt bàn thành công!");
      loadOrders(); // reload lại danh sách
    } catch (err: any) {
      alert(err.message || "Hủy thất bại");
    }
  };

  // ==============================
  // UI
  // ==============================

  return (
    <div style={{ padding: "30px" }}>
      <h2>Danh sách bàn đã đặt</h2>

      {loading && <p>Đang tải dữ liệu...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {!loading && orders.length === 0 && (
        <p>Bạn chưa đặt bàn nào.</p>
      )}

      {orders.length > 0 && (
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Thời gian bắt đầu</th>
              <th>Thời gian kết thúc</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>{order.id}</td>
                <td>{new Date(order.start).toLocaleString()}</td>
                <td>{new Date(order.end).toLocaleString()}</td>
                <td>{order.status ? "Đã đặt" : "Đã hủy"}</td>
                <td>
                  {order.status  && (
                    <button
                      onClick={() => handleCancel(order.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "5px 10px",
                        cursor: "pointer",
                      }}
                    >
                      Hủy
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
}