import React from "react";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

function UserIcon() {
  const navigate = useNavigate();

  const handleUserClick = () => {
    navigate("/profile");
  };

  return (
    <div className="w-[4%] bg-slate-950 text-white flex flex-col justify-start">
      <div className="p-2">
        <button
          onClick={handleUserClick}
          className="text-3xl p-2 hover:bg-gray-600 rounded-lg duration-300 transition-all"
          title="User Profile"
        >
          <FaUser />
        </button>
      </div>
    </div>
  );
}

export default UserIcon; 