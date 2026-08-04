import React, { useContext, useEffect } from "react";
import { FaUser } from "react-icons/fa6";
import { MdLockOutline } from "react-icons/md";
import { MdOutlineMailOutline } from "react-icons/md";
import { TbUsers } from "react-icons/tb";
import { SlLogout } from "react-icons/sl";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const LeftProfile = () => {
  const {
    active,
    setActive,
    authUrl,
    setUser,
    setIsAuthentication,
    accessToken,
    allUsers,
    setAllUsers,
    userUrl,
    stats, setStats,
    user
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const activeStyle = "bg-[#1E293B] border border-[#D4AF37]/40 text-[#D4AF37]";

  const normalStyle = "text-gray-300 hover:bg-[#182133] hover:text-[#E6C76B]";

  const logoutHandle = async () => {
    try {
      const response = await axios.post(
        `${authUrl}/logout`,
        {},
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setIsAuthentication(false);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data.message);
    }
  };

  const managementSubmit = async (e) => {
   
    try {
      if(!user || user.role !== "admin") {
        setActive("Profile");
        toast.error("You are not authorized to access this page.");
        return;
      }
      const response = await axios.get(`${userUrl}`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (response.data.success) {
        console.log("user ka data :", response.data)
        setAllUsers(response.data.user);
        setStats({
            totalUsers: response.data.totalUsers,
            activeUsers: response.data.activeUsers,
            blockedUsers: response.data.blockedUsers,
            totalAdmins: response.data.totalAdmins,
        })
        setActive("UserMangement");
      }
    } catch (error) {
      console.log("Error fetching users:", error.message);
    }
  };

  return (
    <div className="min-w-[280px] bg-[#0F172A] border-r border-[#2A3446]">
      <div className="flex flex-col justify-between h-[500px] p-6">
        <div className="space-y-2">
          <button
            onClick={() => setActive("Profile")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${
              active === "Profile" ? activeStyle : normalStyle
            }`}
          >
            <FaUser className="text-lg" />
            <span>Profile</span>
          </button>

          <button
            onClick={() => setActive("ChangePassword")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${
              active === "ChangePassword" ? activeStyle : normalStyle
            }`}
          >
            <MdLockOutline className="text-xl" />
            <span>Change Password</span>
          </button>

          <button
            onClick={() => setActive("ChangeEmail")}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${
              active === "ChangeEmail" ? activeStyle : normalStyle
            }`}
          >
            <MdOutlineMailOutline className="text-xl" />
            <span>Change Email</span>
          </button>

          <div className="border-t border-[#2A3446] my-4"></div>

          <button
            onClick={() => {
              setActive("UserMangement");
              managementSubmit();
            }}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition cursor-pointer ${
              active === "UserMangement" ? activeStyle : normalStyle
            }`}
          >
            <TbUsers className="text-xl" />
            <span className="flex gap-5 items-center">Management <p className="text-red-500 text-sm">admin</p></span>
          </button>
        </div>

        <button
          onClick={logoutHandle}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition cursor-pointer"
        >
          <SlLogout className="text-lg" />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default LeftProfile;
