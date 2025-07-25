// src/components/Sidebar.tsx
import React, { useState } from "react";
import { FaHome, FaUser, FaBell, FaFileAlt, FaSignOutAlt, FaSchool } from "react-icons/fa";
import { NavLink, useNavigate } from "react-router-dom";
import Modal from "./Modal"; // pastikan ini ada
import Button from "./Button"; // pastikan ini ada juga


const Sidebar: React.FC = () => {
  const navigate = useNavigate();


  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const menu = [
    { name: "Dashboard", icon: <FaHome />, to: "/dashboard" },
    { name: "Nasabah", icon: <FaUser />, to: "/ProfileNasabah" },
    { name: "Akademi Arus", icon: <FaSchool />, to: "/akademiarus" },
  ];

  const handleConfirmLogout = () => {
    localStorage.removeItem("access_token");
    setIsLogoutModalOpen(false);
    navigate("/login");
  };

  return (
    <>
      <aside className="h-screen w-64 bg-white border-r shadow-md fixed left-0 top-0 ">
        <div className="flex items-center justify-center h-16 border-b">
          <img
              src="https://i.imgur.com/l82Pfyy.png"
              alt="Arus AI Logo"
              className="h-10"
            />
          <h1 className="text-xl font-bold text-blue-700 ml-2">ARUS AI</h1>
        </div>
        <nav className="mt-4">
          <ul className="flex flex-col gap-2 p-4">
            {menu.map((item, index) => (
              <li key={index}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-4 px-4 py-2 rounded-md font-medium transition-colors ${
                      isActive
                        ? "bg-blue-100 text-blue-800"
                        : "text-gray-700 hover:bg-gray-100"
                    }`
                  }
                >
                  <span className="text-lg">{item.icon}</span>
                  <span>{item.name}</span>
                </NavLink>
              </li>
            ))}

            {/* Logout Button */}
            <li>
              <button
                onClick={() => setIsLogoutModalOpen(true)}
                className="flex items-center gap-4 px-4 py-2 rounded-md font-medium text-red-600 hover:bg-red-50 transition-colors w-full text-left"
              >
                <span className="text-lg">
                  <FaSignOutAlt />
                </span>
                <span>Logout</span>
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Modal Logout */}
      <Modal
        visible={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
      >
        <div className="text-center p-4">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            Konfirmasi Logout
          </h2>
          <p className="text-gray-600 mb-8">Apakah Anda yakin ingin keluar?</p>
          <div className="flex justify-center gap-4">
            <Button
              onClick={() => setIsLogoutModalOpen(false)}
              text="Tidak"
              styleType="secondary"
            />
            <Button
              onClick={handleConfirmLogout}
              text="Iya, Keluar"
              styleType="danger"
            />
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Sidebar;
