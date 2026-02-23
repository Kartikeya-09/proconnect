import React from "react";
import NavbarComponent from "@/Components/Navbar";

function UserLayout({ children }) {
  return (
    <div className="min-h-screen">
      <NavbarComponent />
      {children}
    </div>
  );
}

export default UserLayout;