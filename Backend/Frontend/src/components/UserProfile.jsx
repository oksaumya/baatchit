import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { IoArrowBack } from "react-icons/io5";
import { FaUser, FaEnvelope, FaPhone, FaEdit } from "react-icons/fa";
import { useAuth } from "../context/AuthProvider";
import axios from "axios";
import toast from "react-hot-toast";

function UserProfile() {
  const navigate = useNavigate();
  const [authUser] = useAuth();
  const [userDetails, setUserDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    fullName: "",
    email: "",
    phone: ""
  });

  useEffect(() => {
    fetchUserDetails();
  }, [authUser]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      
      // Get user data from auth context first
      if (authUser) {
        console.log("Auth user data:", authUser);
        
        // Parse the user data if it's a string
        let userData = authUser;
        if (typeof authUser === 'string') {
          try {
            userData = JSON.parse(authUser);
          } catch (e) {
            console.error("Error parsing auth user:", e);
          }
        }

        setUserDetails({
          username: userData?.username || userData?.fullName || "User",
          fullName: userData?.fullName || userData?.username || "User",
          email: userData?.email || "Not set",
          phone: userData?.phone || "Not set"
        });

        setEditForm({
          fullName: userData?.fullName || userData?.username || "",
          email: userData?.email || "",
          phone: userData?.phone || ""
        });
      }

      // Try to get additional details from API
      try {
        const token = localStorage.getItem("ChatApp");
        if (token) {
          const response = await axios.get("/api/user/profile", {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          // Merge API data with auth data
          setUserDetails(prev => ({
            ...prev,
            ...response.data,
            username: response.data.username || prev.username,
            fullName: response.data.fullName || prev.fullName,
            email: response.data.email || prev.email,
            phone: response.data.phone || prev.phone
          }));

          setEditForm(prev => ({
            fullName: response.data.fullName || prev.fullName,
            email: response.data.email || prev.email,
            phone: response.data.phone || prev.phone
          }));
        }
      } catch (apiError) {
        console.log("API call failed, using auth data only:", apiError);
      }

      setLoading(false);
    } catch (error) {
      console.error("Error fetching user details:", error);
      toast.error("Failed to load user details");
      setLoading(false);
    }
  };

  const handleUpdateProfile = async () => {
    try {
      const token = localStorage.getItem("ChatApp");
      const response = await axios.put("/api/user/profile", editForm, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      setUserDetails(prev => ({ ...prev, ...response.data }));
      setIsEditing(false);
      toast.success("Profile updated successfully");
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error("Failed to update profile");
    }
  };

  const handleBackClick = () => {
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <div className="bg-slate-800 p-4 shadow-lg">
        <div className="flex items-center space-x-4">
          <button
            onClick={handleBackClick}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            title="Back to Chat"
          >
            <IoArrowBack className="text-2xl" />
          </button>
          <h1 className="text-2xl font-bold">User Profile</h1>
        </div>
      </div>

      {/* Profile Content */}
      <div className="max-w-2xl mx-auto p-6">
        <div className="bg-slate-800 rounded-xl p-8 shadow-lg">
          {/* Profile Picture Section */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-32 h-32 bg-blue-600 rounded-full flex items-center justify-center mb-4">
              <FaUser className="text-6xl text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">
              {userDetails?.fullName || userDetails?.username || "User Name"}
            </h2>
            <p className="text-gray-400">Member since {new Date().getFullYear()}</p>
          </div>

          {/* Profile Details */}
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Profile Information</h3>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                <FaEdit className="text-sm" />
                <span>{isEditing ? "Cancel" : "Edit"}</span>
              </button>
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={editForm.fullName}
                    onChange={(e) => setEditForm({...editForm, fullName: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Enter your full name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({...editForm, email: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Enter your email"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-700 border border-gray-600 rounded-lg focus:outline-none focus:border-blue-500 text-white"
                    placeholder="Enter your phone number"
                  />
                </div>
                <button
                  onClick={handleUpdateProfile}
                  className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-lg font-medium transition-colors"
                >
                  Save Changes
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                  <FaUser className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-400">Username</p>
                    <p className="font-medium">{userDetails?.username || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                  <FaUser className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-400">Full Name</p>
                    <p className="font-medium">{userDetails?.fullName || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                  <FaEnvelope className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-400">Email</p>
                    <p className="font-medium">{userDetails?.email || "Not set"}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4 p-4 bg-slate-700 rounded-lg">
                  <FaPhone className="text-blue-400 text-xl" />
                  <div>
                    <p className="text-sm text-gray-400">Phone</p>
                    <p className="font-medium">{userDetails?.phone || "Not set"}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Account Stats */}
          <div className="mt-8 pt-8 border-t border-gray-700">
            <h3 className="text-lg font-semibold mb-4">Account Statistics</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-blue-400">0</p>
                <p className="text-sm text-gray-400">Messages Sent</p>
              </div>
              <div className="bg-slate-700 p-4 rounded-lg text-center">
                <p className="text-2xl font-bold text-green-400">0</p>
                <p className="text-sm text-gray-400">Conversations</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserProfile; 