import React, { useState } from "react";
import { MdOutlineMailOutline } from "react-icons/md";
import { IoMdCall } from "react-icons/io";
import { SlCalender } from "react-icons/sl";
import { GoPencil } from "react-icons/go";
import { useContext } from "react";
import { StoreContext } from "../../Context/StoreContext";
import { FaCamera } from "react-icons/fa";
import ChangePofilePicture from "../Change/ChangePofilePicture";
import { RiShieldCheckLine } from "react-icons/ri";

const RightProfileUpper = () => {
  const { uploadProfile, setUploadProfile, profileImage } =
    useContext(StoreContext);
  const { user } = useContext(StoreContext);
  return (
    <div className="bg-gradient-to-r from-[#734309] to-[#8B6A2D] h-[220px] w-full rounded flex justify-between  items-center p-7 relative">
      <div className="flex items-center gap-7 p-4">
        <div className="relative">
          <div className="w-44 h-44 rounded-full overflow-hidden border-2 border-white ">
            <img
              src={profileImage || user?.avatar}
              alt="Profile"
              className="w-full h-full object-cover scale-110  bg-gray-950"
            />
          </div>
          <span
            onClick={() => setUploadProfile(!uploadProfile)}
            className="absolute bottom-3 right-3 cursor-pointer "
          >
            <FaCamera className="size-8" />
          </span>
        </div>
        <div className="space-y-1.5">
          <h2 className="sm:text-lg md:text-3xl font-medium">{user?.name}</h2>
          <p className="w-18 px-2 rounded-2xl border text-[#D4AF37]">
            {user?.role}
          </p>
          <p className="sm:text-sm md:text-md flex gap-2 items-center text-center font-medium">
            <MdOutlineMailOutline className="text-[#D4AF37]" />
            <span>{user?.email}</span>
          </p>

          <p className="sm:text-sm md:text-md flex gap-2 items-center  font-medium">
            <SlCalender className="text-[#D4AF37] font-medium" />
            <span>
              {user?.date
                ? new Date(user.date).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })
                : ""}
            </span>
          </p>
        </div>
      </div>
      <div
  className="flex items-center gap-4
             px-5 py-4
             rounded-2xl
             bg-[#1B1A1D]/90
             border border-[#E6C76B]/20
             shadow-xl
             w-[430px]"
>
  {/* Icon */}
  <div
    className="w-14 h-14
               rounded-xl
               bg-[#1E293B]
               border border-[#D4AF37]/20
               flex items-center justify-center
               shrink-0"
  >
    <RiShieldCheckLine className="text-3xl text-[#F4D35E]" />
  </div>

  {/* Text */}
  <div>
    <p className="text-[11px] tracking-[4px] uppercase text-[#D4AF37]/80">
      Security Platform
    </p>

    <h2 className="text-[20px] font-bold text-white leading-tight mt-1">
      SecureAuth
    </h2>

    <p className="text-sm text-gray-300 mt-1">
      OAuth 2.0 • JWT • RBAC
    </p>
  </div>
</div>
      {uploadProfile ? (
        <div className="absolute top-[50%] left-[34%]">
          <ChangePofilePicture />
        </div>
      ) : (
        ""
      )}
    </div>
  );
};

export default RightProfileUpper;
