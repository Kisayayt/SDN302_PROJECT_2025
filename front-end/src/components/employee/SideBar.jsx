import React from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

// Import MUI Icons
import FactCheckIcon from "@mui/icons-material/FactCheck";
import PeopleAltIcon from "@mui/icons-material/PeopleAlt";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import CurrencyExchangeIcon from "@mui/icons-material/CurrencyExchange";
import WalletIcon from "@mui/icons-material/Wallet";
import AccessAlarmIcon from "@mui/icons-material/AccessAlarm";
import ReceiptIcon from "@mui/icons-material/Receipt";
import BarChartIcon from "@mui/icons-material/BarChart";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { Typography } from "@mui/material";

const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const menuItems = [
    {
      path: "/admin/dashboard",
      icon: <PeopleAltIcon />,
      label: "Quản lí người dùng",
      match: ["/users/dashboard", "/users/search", "/userDetails"],
    },
    {
      path: "/admin/departments",
      icon: <MeetingRoomIcon />,
      label: "Quản lí phòng ban",
      match: ["/departments", "/departments/search"],
    },
    {
      path: "/admin/checkinout",
      icon: <FactCheckIcon />,
      label: "Quản lí chấm công",
      match: [
        "/admin/checkinout",
        "/admin/search",
        "/admin.requests",
        "/payroll.form",
        "/payroll.calculate",
        "/leave_requests.index",
        "/checkinout/search",
        "/checkinout/filterByDate",
      ],
    },
    {
      path: "/salaryLevels",
      icon: <CurrencyExchangeIcon />,
      label: "Quản lí bậc lương",
      match: ["/salaryLevels"],
    },
    {
      path: "/payrolls",
      icon: <WalletIcon />,
      label: "Quản lí trả lương",
      match: ["/payrolls"],
    },
    {
      path: "/admin/workTime",
      icon: <AccessAlarmIcon />,
      label: "Đổi thời gian làm việc",
      match: ["/admin/workTime"],
    },
    {
      path: "/reasons",
      icon: <ReceiptIcon />,
      label: "Quản lý các lý do",
      match: ["/reasons"],
    },
    {
      path: "/chart",
      icon: <BarChartIcon />,
      label: "Bảng tổng quan",
      match: ["/chart"],
    },
  ];

  // Xác định item nào active
  const isActive = (matches) =>
    matches.some((route) => location.pathname.includes(route));

  return (
    <div style={{ marginRight: "20px" }} className="list-group" id="sidebar">
      {menuItems.map((item) => (
        <NavLink
          to={item.path}
          key={item.path}
          className={`list-group-item list-group-item-action d-flex align-items-center ${
            isActive(item.match) ? "active" : ""
          }`}
        >
          <span className="me-2">{item.icon}</span> {item.label}
        </NavLink>
      ))}

      {/* Đăng xuất */}
      <form action="/logout" method="post">
        <button
          type="submit"
          onClick={() => {
            localStorage.removeItem("token");
            navigate("/login");
          }}
          className="list-group-item list-group-item-action d-flex align-items-center"
          style={{ background: "none", cursor: "pointer" }}
        >
          <span className="me-2">
            <ExitToAppIcon />
          </span>
          Đăng xuất
        </button>
      </form>
    </div>
  );
};

export default Sidebar;
