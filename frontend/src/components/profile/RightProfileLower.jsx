import React from "react";
import { CiUser } from "react-icons/ci";
import { GoPencil } from "react-icons/go";
import { FaUser } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { FaPhoneAlt } from "react-icons/fa";
import { MdVerified } from "react-icons/md";
import { HiMiniShieldCheck } from "react-icons/hi2";
import { FaRegCalendarAlt } from "react-icons/fa";

import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { useEffect } from "react";

const RightProfileLower = () => {
  const {user} = useContext(StoreContext);
  useEffect(()=>{
    console.log(user.verified)
  },[])
  return (
    <div className="bg-[#111827] border border-[#C9A227]/25 rounded-2xl p-6">

      {/* Heading */}
      <h1 className="flex items-center gap-3 text-3xl text-[#E6C76B] font-semibold mb-6">
        <CiUser className="border border-[#C9A227]/40 rounded-full p-1 text-4xl" />
        Account Information
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

        <div className="flex justify-between items-center bg-[#182133] rounded-xl border border-white/10 p-5 hover:border-[#C9A227]/40 transition">
          <div className="flex gap-4">
            <FaUser className="text-[#D4AF37] text-xl mt-1" />
            <div>
              <p className="text-sm text-gray-400">Full Name</p>
              <p className="text-white font-medium">{user?.name}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-[#182133] rounded-xl border border-white/10 p-5 hover:border-[#C9A227]/40 transition">
          <div className="flex gap-4">
            <HiMiniShieldCheck className="text-[#D4AF37] text-2xl" />
            <div>
              <p className="text-sm text-gray-400">Account Role</p>

              <span className="px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 text-sm">
                {user?.role}
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-[#182133] rounded-xl border border-white/10 p-5 hover:border-[#C9A227]/40 transition">
          <div className="flex gap-4">
            <MdOutlineMailOutline className="text-[#D4AF37] text-2xl" />

            <div>
              <p className="text-sm text-gray-400">Email Address</p>
              <p className="text-white font-medium">{user?.email}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-[#182133] rounded-xl border border-white/10 p-5 hover:border-[#C9A227]/40 transition">
          <div className="flex gap-4">
            <MdVerified className="text-[#D4AF37] text-2xl" />

            <div className="flex flex-col gap-1">
              <p className="text-sm text-gray-400">Email Status</p>

              <span className="px-3 py-1 rounded-full bg-green-500/20 text-green-300 text-sm ">
                {
                  user?.verified ? "Verified" : "Unverified"
                }
              </span>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center bg-[#182133] rounded-xl border border-white/10 p-5 hover:border-[#C9A227]/40 transition">
          <div className="flex gap-4">
            <FaRegCalendarAlt className="text-[#D4AF37] text-xl mt-1" />

            <div>
              <p className="text-sm text-gray-400">Member Since</p>
              <p className="text-white font-medium">
                {user?.date
                ? new Date(user.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default RightProfileLower;