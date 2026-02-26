import React, { useEffect, useState } from "react";

interface Table {
  id: number;
  capacity: number;
  status: boolean;
}

const AdminTablePage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // state cho form thêm bàn
  const [capacity, setCapacity] = useState<number>(0);
  const [status, setStatus] = useState<boolean>(true);

  // ===============================
  // API CALLS
  // ===============================

  const getAllTable = async () => {
    const res = await fetch(`https://expressbackend-production-032e.up.railway.app/table/findAll`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      throw new Error("Không thể tải danh sách bàn");
    }

    return await res.json();
  };

  const addTable = async (capacity: number, status: boolean) => {
    const res = await fetch(`https://expressbackend-production-032e.up.railway.app/table/add`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
      body: JSON.stringify({
        capacity: capacity,
        status: status,
      }),
    });

    if (!res.ok) {
      throw new Error("Không thể thêm bàn");
    }

    return res;
  };

  const stopTable = async (id: number) => {
    const res = await fetch(
      `https://expressbackend-production-032e.up.railway.app/table/stop/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (!res.ok) {
      throw new Error("Không thể ngừng phục vụ bàn");
    }

    return res;
  };

  const startTable = async (id: number) => {
    const res = await fetch(
      `https://expressbackend-production-032e.up.railway.app/table/start/${id}`,
      {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("token"),
        },
      }
    );

    if (!res.ok) {
      throw new Error("Không thể mở lại bàn");
    }

    return res;
  };

  // ===============================
  // LOAD DATA
  // ===============================

  const fetchTables = async () => {
    try {
      setLoading(true);
      const data = await getAllTable();
      setTables(data);
    } catch (error) {
      console.error(error);
      alert("Lỗi khi tải danh sách bàn");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTables();
  }, []);

  // ===============================
  // HANDLE ACTION
  // ===============================

  const handleAddTable = async () => {
    if (capacity <= 0) {
      alert("Sức chứa phải lớn hơn 0");
      return;
    }

    try {
      await addTable(capacity, status);
      alert("Thêm bàn thành công");

      setCapacity(0);
      setStatus(true);
      fetchTables(); // reload lại danh sách
    } catch (error) {
      console.error(error);
      alert("Không thể thêm bàn");
    }
  };

  const handleStop = async (id: number) => {
    try {
      await stopTable(id);
      fetchTables();
    } catch (error) {
      console.error(error);
      alert("Không thể ngừng phục vụ bàn");
    }
  };

  const handleStart = async (id: number) => {
    try {
      await startTable(id);
      fetchTables();
    } catch (error) {
      console.error(error);
      alert("Không thể mở lại bàn");
    }
  };

  // ===============================
  // UI
  // ===============================

  return (
    <div style={{ padding: "20px" }}>
      <h2>Quản lý bàn</h2>

      {/* FORM THÊM BÀN */}
      <div style={{ marginBottom: "20px" }}>
        <h3>Thêm bàn mới</h3>

        <input
          type="number"
          placeholder="Sức chứa"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
          style={{ marginRight: "10px", padding: "5px" }}
        />

        <select
          value={status ? "true" : "false"}
          onChange={(e) => setStatus(e.target.value === "true")}
          style={{ marginRight: "10px", padding: "5px" }}
        >
          <option value="true">Có thể phục vụ</option>
          <option value="false">Ngừng phục vụ</option>
        </select>

        <button
          onClick={handleAddTable}
          style={{
            backgroundColor: "blue",
            color: "white",
            border: "none",
            padding: "6px 12px",
            cursor: "pointer",
          }}
        >
          Thêm bàn
        </button>
      </div>

      {loading ? (
        <p>Đang tải dữ liệu...</p>
      ) : (
        <table
          border={1}
          cellPadding={10}
          style={{ borderCollapse: "collapse", width: "100%" }}
        >
          <thead>
            <tr>
              <th>ID</th>
              <th>Sức chứa</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            {tables.map((table) => (
              <tr key={table.id}>
                <td>{table.id}</td>
                <td>{table.capacity}</td>
                <td>
                  {table.status ? "Đang phục vụ" : "Ngừng phục vụ"}
                </td>
                <td>
                  {table.status ? (
                    <button
                      onClick={() => handleStop(table.id)}
                      style={{
                        backgroundColor: "red",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Ngừng phục vụ
                    </button>
                  ) : (
                    <button
                      onClick={() => handleStart(table.id)}
                      style={{
                        backgroundColor: "green",
                        color: "white",
                        border: "none",
                        padding: "6px 12px",
                        cursor: "pointer",
                      }}
                    >
                      Mở lại phục vụ
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

export default AdminTablePage;