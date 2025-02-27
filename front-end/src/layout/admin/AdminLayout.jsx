import React from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import { Outlet } from "react-router-dom";

function AdminLayout() {
  return (
    <div>
      <AdminHeader />
      <Outlet />
      <AdminFooter />
    </div>
  );
}

export default AdminLayout;
