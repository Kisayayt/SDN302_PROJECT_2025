import { jwtDecode } from "jwt-decode";
import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function AdminDashboard() {
  const navigate = useNavigate();
  console.log("admin is in here once");

  // Dùng để kiểm tra xem người dùng đã đăng nhập chưa và có phải là employee không
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    try {
      const decoded = jwtDecode(token);
      console.log(decoded);

      if (decoded.role !== "admin") {
        localStorage.removeItem("token");
        navigate("/login");
      }
    } catch (error) {
      console.error("Invalid token:", error);
      localStorage.removeItem("token");
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <h1>Welcome admin!</h1>
      <button
        onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}
      >
        Đăng xuất
      </button>
    </div>
  );
}

export default AdminDashboard;
