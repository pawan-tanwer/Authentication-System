import React, { useContext, useState } from "react";
import { MdEmail } from "react-icons/md";
import { IoMdLock } from "react-icons/io";
import { IoAlertOutline } from "react-icons/io5";
import { CiLock } from "react-icons/ci";
import { BsShieldLockFill } from "react-icons/bs";
import { FaRegCheckCircle } from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ChangePassword = () => {
  const { setActive, userUrl, accessToken } = useContext(StoreContext);
  const [eye, setEye] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const [data, setData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const onChangeHandle = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePassword = async (e) => {
    e.preventDefault();

    try {
      console.log("before axios :");
      setMessage({ type: "", text: "" });
      const response = await axios.patch(
        `${userUrl}/change-password`,
        {
          currentPassword: data.currentPassword.trim(),
          newPassword: data.newPassword.trim(),
          confirmPassword: data.confirmPassword.trim(),
        },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        },
      );
      console.log("after axios");
      if (response.data.success) {
        toast.success(response.data.message);
        setActive("Profile");
        setData({
          currentPassword: "",
          newPassword: "",
          confirmPassword: "",
        });
        toast.success("Password change successfully")
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to Update the Password",
      });
    }
  };
  return (
    <div className="w-full px-4 py-5">
      <div className="h-full w-ull flex flex-col  gap-24">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-full bg-[#3D3219]">
            <IoMdLock className="size-10 text-[#D4AF37]" />
          </div>
          <div>
            <h2 className="sm:text-lg md:text-2xl font-medium text-[#D4AF37]">
              Change Password
            </h2>
            <p className="sm:text-sm md:text-md text-gray-400">
              Ensure your account is using a strong,unique password
            </p>
          </div>
        </div>
        <div className="flex w-full p-6 rounded-2xl bg-[#141A27] border border-[#5B4722] items-center justify-between">
          <div className="flex flex-col gap-7">
            <div className="flex flex-col gap-1">
              <label>Current Password</label>
              <div className="relative w-[700px]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="currentPassword"
                  value={data.currentPassword}
                  onChange={onChangeHandle}
                  className="w-full bg-[#192132] border border-[#2A3448] text-white placeholder:text-[#7F8AA3] rounded-xl px-4 py-3 pr-12 outline-none focus:border-[#4F46E5] transition-colors"
                  placeholder="Enter your current password"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition-colors"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1 w-[700px]">
              <label htmlFor="">New Password</label>
              <div className="relative w-[700px]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="newPassword"
                  value={data.newPassword}
                  onChange={onChangeHandle}
                  className="w-full bg-[#192132] border border-[#2A3448] text-white placeholder:text-[#7F8AA3] rounded-xl px-4 py-3 pr-12 outline-none focus:border-[#4F46E5] transition-colors"
                  placeholder="Enter your new password"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition-colors"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div className="flex flex-col gap-1">
              <label htmlFor="">Confirm New Password</label>
              <div className="relative w-[700px]">
                <input
                  type={showPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={data.confirmPassword}
                  onChange={onChangeHandle}
                  className="w-full bg-[#192132] border border-[#2A3448] text-white placeholder:text-[#7F8AA3] rounded-xl px-4 py-3 pr-12 outline-none focus:border-[#4F46E5] transition-colors"
                  placeholder="Enter your confirm password"
                />
                <span
                  onClick={() => setShowPassword((prev) => !prev)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-white transition-colors"
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </span>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <div className="flex justify-between items-center gap-1 text-sm">
                <span className=" rounded-full border p-0.5 text-blue-600">
                  <IoAlertOutline />
                </span>
                <p className="bg-[#1A273E] p-2 rounded text-gray-400">
                  Use at least 8 characters with a mix of letters,numbers &
                  symbols
                </p>
              </div>
              <div>
                {message.text && (
                  <p
                    className={`text-sm mb-4 ${
                      message.type === "success"
                        ? "text-green-400"
                        : "text-red-400"
                    }`}
                  >
                    {message.text}
                  </p>
                )}
                <button
                  onClick={updatePassword}
                  className="flex gap-1 items-center  p-2 py-3 rounded cursor-pointer bg-gradient-to-r from-[#2563EB] to-[#3B82F6] "
                >
                  <CiLock />
                  <span>Update Password</span>
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-col items-center w-sm gap-6">
            <div>
              <BsShieldLockFill className="size-24 " />
            </div>
            <div className="flex flex-col border-2 border-[#1E2640] w-sm p-3 gap-1 rounded bg-[#0e1322]">
              <h6 className="text-purple-400">Password must contain : </h6>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                At least 8 character
              </p>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                One uppercase letter
              </p>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                One lowercase letter
              </p>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                One number
              </p>
              <p className="flex items-center gap-2 text-green-300">
                <FaRegCheckCircle className="text-green-500" />
                One special character
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;
