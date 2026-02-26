import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

interface DishOrderDetail {
  dishOrderId: number;
  dishId: number;
  dishname: string;
  quantity: number;
  priceOf1: number;
}

const DishOrderDetailPage: React.FC = () => {
  const { id } = useParams(); // lấy id từ URL
  const [details, setDetails] = useState<DishOrderDetail[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>("");

  // ==========================
  // CALL API
  // ==========================
  const dishOrderDetail = async (id: string) => {
    const res = await fetch(
      `https://expressbackend-production-032e.up.railway.app/dishOrderDetail/details/${id}`,
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!id) return;

        const res = await dishOrderDetail(id);

        if (!res.ok) {
          throw new Error("Không thể tải dữ liệu");
        }

        const data = await res.json();
        setDetails(data);
      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  // ==========================
  // TÍNH TỔNG TIỀN
  // ==========================
  const totalAmount = details.reduce(
    (sum, item) => sum + item.quantity * item.priceOf1,
    0
  );

  if (loading) return <h2>Đang tải dữ liệu...</h2>;
  if (error) return <h2 style={{ color: "red" }}>{error}</h2>;

  return (
    <div style={{ padding: "20px" }}>
      <h1>Chi tiết hóa đơn</h1>

      <table
        border={1}
        cellPadding={10}
        style={{ borderCollapse: "collapse", width: "100%" }}
      >
        <thead>
          <tr>
            <th>DishOrderId</th>
            <th>DishId</th>
            <th>Tên món</th>
            <th>Số lượng</th>
            <th>Giá 1 món</th>
            <th>Thành tiền</th>
          </tr>
        </thead>
        <tbody>
          {details.map((item) => (
            <tr key={item.dishId}>
              <td>{item.dishOrderId}</td>
              <td>{item.dishId}</td>
              <td>{item.dishname}</td>
              <td>{item.quantity}</td>
              <td>{item.priceOf1.toLocaleString()} VND</td>
              <td>
                {(item.quantity * item.priceOf1).toLocaleString()} VND
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <h2 style={{ marginTop: "20px" }}>
        Tổng tiền: {totalAmount.toLocaleString()} VND
      </h2>
    </div>
  );
};

export default DishOrderDetailPage;