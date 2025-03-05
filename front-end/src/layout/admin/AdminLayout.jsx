import React from "react";
import AdminHeader from "../../components/admin/AdminHeader";
import AdminFooter from "../../components/admin/AdminFooter";
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
