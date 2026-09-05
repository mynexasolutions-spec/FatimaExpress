"use client";

import { createContext, useContext, useState } from "react";

const AdminSidebarContext = createContext(null);

export function AdminSidebarProvider({ children }) {
  const [mobileOpen, setMobileOpen] = useState(false);
  return (
    <AdminSidebarContext.Provider value={{ mobileOpen, setMobileOpen }}>{children}</AdminSidebarContext.Provider>
  );
}

export function useAdminSidebar() {
  const context = useContext(AdminSidebarContext);
  if (!context) throw new Error("useAdminSidebar must be used inside AdminSidebarProvider");
  return context;
}
