import React, { useContext, useEffect, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiMoreVertical,
} from "react-icons/fi";
import {
  HiOutlineUsers,
  HiOutlineShieldCheck,
  HiOutlineUserGroup,
} from "react-icons/hi2";
import { MdBlockFlipped, MdLockOpen } from "react-icons/md";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";

const roleStyles = {
  Admin: "bg-purple-500/15 text-purple-400 border border-purple-500/30",
  User: "bg-blue-500/15 text-blue-400 border border-blue-500/30",
};

const UserManagement = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = 18;
  const { allUsers, setAllUsers, user, stats, setStats, userUrl, accessToken } =
    useContext(StoreContext);
  const [data, setData] = useState({
    id: "",
    role: "",
  });

  const statsData = [
    {
      label: "Total Users",
      subLabel: "All registered users",
      value: stats.totalUsers,
      icon: HiOutlineUsers,
      color: "text-indigo-400",
      bg: "bg-indigo-500/15",
    },
    {
      label: "Active Users",
      subLabel: "Currently active",
      value: stats.activeUsers,
      icon: HiOutlineShieldCheck,
      color: "text-green-400",
      bg: "bg-green-500/15",
    },
    {
      label: "Admins",
      subLabel: "Administrators",
      value: stats.totalAdmins,
      icon: HiOutlineUserGroup,
      color: "text-amber-400",
      bg: "bg-amber-500/15",
    },
    {
      label: "Blocked Users",
      subLabel: "Currently blocked",
      value: stats.blockedUsers,
      icon: MdBlockFlipped,
      color: "text-red-400",
      bg: "bg-red-500/15",
    },
  ];

  useEffect(() => {
    const fetchData = () => {
      const managementSubmit = async (e) => {
        try {
          const response = await axios.get(`${userUrl}`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          });

          if (response.data.success) {
            console.log("stats :", response.data);
            setAllUsers(response.data.user);
            setStats({
              totalUsers: response.data.totalUsers,
              activeUsers: response.data.activeUsers,
              blockedUsers: response.data.blockedUsers,
              totalAdmins: response.data.totalAdmins,
            });
          }
        } catch (error) {
          console.log("Error fetching users:", error.message);
        }
      };
    };
    fetchData();
  }, []);

  const roleChangeHandler = async (e, userId) => {
    const { value } = e.target;

    setData((prev) => ({ ...prev, id: userId, role: value }));

    console.log("Changing role for user:", data);
    try {
      const response = await axios.patch(
        `${userUrl}/${userId}/role`,
        { role: value },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      );

      if (response.data.success) {
        toast.success(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  const blockUnblockHandler = async (isBlocked, userId) => {
    try {
      const response = await axios.patch(
        `${userUrl}/block/${userId}`,
        { isBlocked: !isBlocked },
        {
          withCredentials: true,
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      ); 

      if (response.data.success) {
        toast.success(response.data.message);
        setAllUsers((prev) =>
          prev.map((u) =>
            u._id === userId ? { ...u, isBlocked: !isBlocked } : u,
          ),
        );
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  return (
    <div className="w-full min-h-screen bg-[#0A0E1A] px-8 py-6 text-white p-2 rounded-2xl">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold">User Management</h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage all users, roles and account status
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-[#141A27] border border-slate-700/60 rounded-lg px-3 py-2 w-64">
            <FiSearch className="text-slate-400" />
            <input
              type="text"
              placeholder="Search users..."
              className="bg-transparent outline-none text-sm placeholder:text-slate-500 w-full"
            />
          </div>

          <button className="flex items-center gap-2 bg-gradient-to-r from-[#7C3AED] to-[#6366F1] rounded-lg px-4 py-2 text-sm font-medium hover:opacity-90 transition-opacity">
            <FiPlus />
            Add User
          </button>
        </div>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, i) => {
          const Icon = stat.icon;
          return (
            <div
              key={i}
              className="flex items-center gap-4 bg-[#0F1420] border border-slate-800 rounded-2xl p-5"
            >
              <div
                className={`h-11 w-11 rounded-full flex items-center justify-center ${stat.bg}`}
              >
                <Icon className={`text-xl ${stat.color}`} />
              </div>
              <div>
                <p className="text-xl font-semibold">{stat.value}</p>
                <p className="text-sm text-slate-300">{stat.label}</p>
                <p className="text-xs text-slate-500">{stat.subLabel}</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Users table */}
      <div className="bg-[#0F1420] border border-slate-800 rounded-2xl overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-800">
              <th className="py-4 px-6 font-medium">User</th>
              <th className="py-4 px-6 font-medium">Email</th>
              <th className="py-4 px-6 font-medium">Role</th>
              <th className="py-4 px-6 font-medium">Status</th>
              <th className="py-4 px-6 font-medium">Joined</th>
              <th className="py-4 px-6 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allUsers && Array.isArray(allUsers) && allUsers.length ? (
              allUsers.map((user, i) => (
                <tr
                  key={i}
                  className="border-b border-slate-800/60 last:border-none hover:bg-[#141A27]/60 transition-colors"
                >
                  <td className="py-3 px-6">
                    <div className="flex items-center gap-3">
                      <img
                        src={user.avatar.url}
                        alt={user.name}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-xs text-slate-500">{user.handle}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-slate-300">{user.email}</td>
                  <td className="py-3 px-6">
                    <select
                      defaultValue={user.role}
                      onChange={(e) => roleChangeHandler(e, user._id)}
                      className={`text-xs font-medium rounded-lg px-3 py-1.5 outline-none bg-gray-700 cursor-pointer ${roleStyles[user.role]}`}
                    >
                      <option>Change the Role</option>
                      <option value="admin">Admin</option>
                      <option value="user">User</option>
                    </select>
                  </td>
                  <td className="py-3 px-6">
                    <span
                      className={`flex items-center gap-1.5 text-xs font-medium ${
                        user.isBlocked ? "text-red-400" : "text-green-400"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          user.isBlocked ? "text-red-400" : "text-green-400"
                        }`}
                      ></span>
                      {user.isBlocked ? "Blocked" : "Active"}
                    </span>
                  </td>
                  <td className="py-3 px-6 text-slate-400">
                    {user?.createdAt
                      ? new Date(user.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : ""}
                  </td>
                  <td className="py-3 px-6">
                    <div
                      onClick={() =>
                        blockUnblockHandler(user.isBlocked, user._id)
                      }
                      className="flex items-center gap-2 cursor-pointer"
                    >
                      {user.isBlocked ? (
                        <button className="flex items-center cursor-pointer gap-1.5 text-xs font-medium text-green-400 border border-green-500/30 bg-green-500/10 rounded-lg px-3 py-1.5 hover:bg-green-500/20 transition-colors">
                          <MdLockOpen />
                          Unblocked
                        </button>
                      ) : (
                        <button className="h-8 w-8 flex items-center cursor-pointer gap-3 w-24 font-medium text-red-400 border border-red-500/30 bg-red-500/10 rounded-lg px-3 py-1.5 hover:bg-red-500/20 transition-color">
                          <MdBlockFlipped />
                          Block
                        </button>
                      )}
                      <button className="h-8 w-8 flex items-center justify-center rounded-lg hover:bg-[#1a2235] transition-colors">
                        <FiMoreVertical className="text-slate-400" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <div> Loading...</div>
            )}
          </tbody>
        </table>

        {/* Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-800">
          <p className="text-sm text-slate-500">Showing 1 to 7 of 120 users</p>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#1a2235] transition-colors"
            >
              <ChevronLeft size={16} />
            </button>

            {[1, 2, 3, 4, 5].map((page) => (
              <button
                key={page}
                onClick={() => setCurrentPage(page)}
                className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                  currentPage === page
                    ? "bg-indigo-600 text-white"
                    : "text-slate-400 hover:bg-[#1a2235]"
                }`}
              >
                {page}
              </button>
            ))}

            <span className="px-1 text-slate-500">...</span>

            <button
              onClick={() => setCurrentPage(totalPages)}
              className={`h-8 w-8 flex items-center justify-center rounded-lg text-sm transition-colors ${
                currentPage === totalPages
                  ? "bg-indigo-600 text-white"
                  : "text-slate-400 hover:bg-[#1a2235]"
              }`}
            >
              {totalPages}
            </button>

            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className="h-8 w-8 flex items-center justify-center rounded-lg text-slate-400 hover:bg-[#1a2235] transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
