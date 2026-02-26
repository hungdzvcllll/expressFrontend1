import React, { useState } from "react";
import { useParams } from "react-router-dom";

interface FreeTimeSlot {
  start: string;
  end: string;
}

const TableOrderPage = () => {
  const { tableId } = useParams<{ tableId: string }>();

  const [date, setDate] = useState("");
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [freeTimes, setFreeTimes] = useState<FreeTimeSlot[]>([]);
  const [message, setMessage] = useState("");

  // ========================
  // 1️⃣ Lấy khung giờ trống (tham khảo)
  // ========================
  const fetchFreeTime = async () => {
    if (!date) {
      alert("Vui lòng chọn ngày");
      return;
    }

    try {
      const res = await fetch(
        `https://expressbackend-production-032e.up.railway.app/tableOrder/freeTime?tableId=${tableId}&date=${date}`,
        {
          headers: {
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
        }
      );

      const data = await res.json();
      setFreeTimes(data);
    } catch (err) {
      console.error(err);
      setMessage("Không lấy được giờ trống");
    }
  };

  // ========================
  // 2️⃣ Đặt bàn
  // ========================
  const handleOrder = async () => {
    if (!date || !startTime || !endTime) {
      alert("Vui lòng nhập đầy đủ ngày và giờ");
      return;
    }

    // Ghép ngày + giờ thành datetime local
    const startLocal = new Date(`${date}T${startTime}`);
    const endLocal = new Date(`${date}T${endTime}`);

    try {
      const res = await fetch(
        "https://expressbackend-production-032e.up.railway.app/tableOrder/order",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            tableId: tableId,
            start: startLocal.toISOString(),
            end: endLocal.toISOString(),
          }),
        }
      );

      if (!res.ok) {
        const errData = await res.json();
        setMessage(errData.message || "Đặt bàn thất bại");
        return;
      }

      setMessage("Đặt bàn thành công!");
    } catch (err) {
      console.error(err);
      setMessage("Lỗi kết nối server");
    }
  };

  return (
    <div style={{ padding: 30 }}>
      <h2>Đặt bàn - Table {tableId}</h2>

      {/* Chọn ngày */}
      <div>
        <label>Ngày: </label>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <button onClick={fetchFreeTime}>Xem giờ trống</button>
      </div>

      {/* Hiển thị giờ trống (chỉ tham khảo) */}
      <div style={{ marginTop: 20 }}>
        <h3>Giờ trống (tham khảo)</h3>
        {freeTimes.map((slot, index) => (
          <div key={index}>
            {slot.start} -{" "}
            {slot.end}
          </div>
        ))}
      </div>

      {/* Người dùng tự chọn giờ */}
      <div style={{ marginTop: 30 }}>
        <h3>Chọn thời gian muốn đặt</h3>

        <div>
          <label>Bắt đầu: </label>
          <input
            type="time"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>

        <div>
          <label>Kết thúc: </label>
          <input
            type="time"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
          />
        </div>

        <button style={{ marginTop: 20 }} onClick={handleOrder}>
          Đặt bàn
        </button>
      </div>

      {message && <p style={{ marginTop: 20 }}>{message}</p>}
    </div>
  );
};

export default TableOrderPage;