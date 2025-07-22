import React from "react";
import { FaUser } from "react-icons/fa";
import { TbLogout2 } from "react-icons/tb";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import toast from "react-hot-toast";
import { useState } from "react";

function Sidebar() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const handleUserClick = () => {
    navigate("/profile");
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      const res = await axios.post("/api/user/logout");
      localStorage.removeItem("ChatApp");
      Cookies.remove("jwt");
      setLoading(false);
      toast.success("Logged out successfully");
      window.location.reload();
    } catch (error) {
      console.log("Error in Logout", error);
      toast.error("Error in logging out");
    }
  };

  return (
    <div className="w-[4%] bg-slate-950 text-white flex flex-col justify-between h-full">
      {/* User Icon at Top */}
      <div className="p-2">
        <button
          onClick={handleUserClick}
          className="text-3xl p-2 hover:bg-gray-600 rounded-lg duration-300 transition-all w-full flex justify-center"
          title="User Profile"
        >
          <FaUser />
        </button>
      </div>

      {/* Logout Icon at Bottom */}
      <div className="p-2">
        <button
          onClick={handleLogout}
          disabled={loading}
          className="text-3xl p-2 hover:bg-gray-600 rounded-lg duration-300 transition-all disabled:opacity-50 w-full flex justify-center"
          title="Logout"
        >
          <TbLogout2 />
        </button>
      </div>
    </div>
  );
}

export default Sidebar; 