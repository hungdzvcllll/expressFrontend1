import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";


const AdminDashBoard: React.FC = () => {
  //const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  // ================= FETCH TABLE =================
  

  //if (loading)
   // return <h2 style={{ textAlign: "center" }}>Đang tải dữ liệu...</h2>;
  
  return (
    <div>
      <nav style={styles.navbar}>
        <h2>🍽 Nhà Hàng Luxury</h2>
        <div>
          <button style={styles.navButton}onClick={()=>navigate("/adminTableManage")}>Quản lý bàn</button>
          <button style={styles.navButton}onClick={()=>navigate("/addDish")}>Thêm món</button>
          
          <button style={styles.navButton}onClick={()=>navigate("/dishOrderAdmin")}>Quản lý danh sách món</button>
        </div>
      </nav>

      <div style={styles.banner}>
        <img
          src="https://images.unsplash.com/photo-1552566626-52f8b828add9"
          alt="Restaurant"
          style={styles.bannerImage}
        />
      </div>
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
  }
};
export default AdminDashBoard;