import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
interface Table {
  id: number;
  capacity: number;
  status: boolean;
}

interface Dish {
  id: number;
  name: string;
  price: number;
  image: string;
}

const RestaurantPage: React.FC = () => {
  const [tables, setTables] = useState<Table[]>([]);
  const [dishes, setDishes] = useState<Dish[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // ================= FETCH TABLE =================
  const getAllTable = async () => {
    const res = await fetch("https://expressbackend-production-032e.up.railway.app/table/findAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || "Không thể tải danh sách bàn"
      );
    }

    return await res.json();
  };

  // ================= FETCH DISH =================
  const findAllDish = async () => {
    const res = await fetch("https://expressbackend-production-032e.up.railway.app/dish/findAll", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("token"),
      },
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);
      throw new Error(
        errorData?.message || "Không thể tải danh sách món ăn"
      );
    }

    return await res.json();
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);

      const tableData = await getAllTable();
      const dishData = await findAllDish();

      setTables(tableData);
      setDishes(dishData);
    } catch (err: any) {
      console.error("Lỗi:", err);
      setError(err.message || "Có lỗi xảy ra khi tải dữ liệu");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading)
    return <h2 style={{ textAlign: "center" }}>Đang tải dữ liệu...</h2>;
  
  if (error)
    return (
      <div style={{ textAlign: "center", marginTop: "50px" }}>
        <h2 style={{ color: "red" }}>⚠ {error}</h2>
        <button onClick={fetchData} style={{ padding: "10px 20px" }}>
          Thử lại
        </button>
      </div>
    );

  return (
    <div>
      <nav style={styles.navbar}>
        <h2>🍽 Nhà Hàng Luxury</h2>
        <div>
          <button style={styles.navButton}onClick={()=>navigate("/dishOrder")}>Đặt món</button>
          <button style={styles.navButton}onClick={()=>navigate("/yourOrder")}>Danh sách đặt món</button>
          
          <button style={styles.navButton}onClick={()=>navigate("/yourTableOrder")}>Danh sách đặt bàn</button>
          <button style={styles.navButton}onClick={()=>navigate("/yourInfo")}>Thông tin của bạn</button>
        </div>
      </nav>

      <div style={styles.banner}>
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          alt="Restaurant"
          style={styles.bannerImage}
        />
      </div>

      <section style={styles.section}>
        <h2>Danh Sách Bàn</h2>
        <div style={styles.grid}>
          {tables.map((table) => (
            <div key={table.id} style={styles.card}>
              <h3>Bàn #{table.id}</h3>
              <p>Sức chứa: {table.capacity} người</p>
              <p>
                Trạng thái:{" "}
                <span
                  style={{
                    color: table.status ? "green" : "red",
                    fontWeight: "bold",
                  }}
                >
                  {table.status ? "Đang mở" : "Chưa mở"}
                </span>
              </p>
              {table.status && (
      <button
        style={styles.bookButton}
        onClick={() => navigate(`/tableOrder/${table.id}`)}
      >
        Đặt bàn
      </button>
    )}
            </div>
          ))}
        </div>
      </section>

      <section style={styles.section}>
        <h2>Danh Sách Món Ăn</h2>
        <div style={styles.grid}>
          {dishes.map((dish) => (
            <div key={dish.id} style={styles.card}>
              <img
                src={"http://localhost:3000" + dish.image}
                alt={dish.name}
                style={styles.dishImage}
              />
              <h3>{dish.name}</h3>
              <p>{dish.price.toLocaleString()} VND</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
const styles: { [key: string]: React.CSSProperties } = {
  navbar: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "15px 40px",
    backgroundColor: "#111",
    color: "white",
  },
  navButton: {
    marginLeft: "10px",
    padding: "8px 15px",
    cursor: "pointer",
  },
  banner: {
    width: "100%",
    height: "400px",
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: "100%",
    objectFit: "cover",
  },
  section: {
    padding: "40px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  card: {
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
    backgroundColor: "white",
  },
  dishImage: {
    width: "100%",
    height: "150px",
    objectFit: "cover",
    borderRadius: "8px",
  },
};
export default RestaurantPage;