import React from "react";
import "./EmployeeHeader.css";
import { jwtDecode } from "jwt-decode";
function EmployeeHeader() {
  const user = localStorage.getItem("token");

  const decoded = jwtDecode(user);
  console.log(decoded);

  return (
    <div>
      <div class="header">
        <h1 class="header-title">Xin chào, {decoded.name}!</h1>
      </div>
    </div>
  );
}

export default EmployeeHeader;
