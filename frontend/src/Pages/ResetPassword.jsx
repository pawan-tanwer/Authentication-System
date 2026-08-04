import React, { useState, useContext } from "react";
import { RiLockPasswordLine } from "react-icons/ri";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { StoreContext } from "../Context/StoreContext";

const ResetPassword = () => {
  const { authUrl, resetToken } = useContext(StoreContext); // resetToken jo verify-otp step se mila hoga
  const navigate = useNavigate();

  const [data, setData] = useState({
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const onChangeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage({ type: "", text: "" });

    if (!data.newPassword || !data.confirmPassword) {
      toast.error("All fields are required");
      return;
    }
    if (data.newPassword.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }
    if (data.newPassword !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);
      const response = await axios.patch(
        `${authUrl}/reset-password`,
        { resetToken: resetToken,
          newPassword: data.newPassword,
          confirmPassword: data.confirmPassword,
        },
        {
          withCredentials: true,
        }
      );

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to reset password",
      });
      toast.error(error.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-[#0A0E1A] px-4">
      <div className="w-full max-w-md p-8 rounded-2xl border border-purple-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)] bg-[#0F1420]">
        {/* Header */}
        <div className="flex flex-col items-center mb-6">
          <div className="h-14 w-14 rounded-full bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-center mb-4">
            <RiLockPasswordLine className="text-indigo-400 text-2xl" />
          </div>
          <h2 className="text-2xl font-bold text-white text-center">
            Reset Password
          </h2>
          <p className="text-sm text-slate-400 text-center mt-2">
            Your identity has been verified. Set your new password below.
          </p>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleResetPassword}
          className="bg-[#090D16] border border-slate-800 rounded-xl p-6 flex flex-col gap-5"
        >
          {/* New Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">New Password</label>
            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                value={data.newPassword}
                onChange={onChangeHandler}
                placeholder="Enter new password"
                className="w-full bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 pr-12 outline-none focus:border-indigo-500/80 transition-colors"
              />
              <span
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white transition-colors"
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Confirm Password */}
          <div className="flex flex-col gap-1">
            <label className="text-sm text-slate-300">Confirm Password</label>
            <div className="relative w-full">
              <input
                type={showConfirmPassword ? "text" : "password"}
                name="confirmPassword"
                value={data.confirmPassword}
                onChange={onChangeHandler}
                placeholder="Re-enter new password"
                className="w-full bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder:text-slate-500 rounded-xl px-4 py-3 pr-12 outline-none focus:border-indigo-500/80 transition-colors"
              />
              <span
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white transition-colors"
              >
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
          </div>

          {/* Password hint */}
          <div className="flex items-start gap-2 bg-[#12182A] border border-slate-800 rounded-xl px-4 py-3 text-sm text-slate-400">
            <span className="mt-0.5">ⓘ</span>
            <p>Password must be at least 8 characters long.</p>
          </div>

          {/* Inline message */}
          {message.text && (
            <p
              className={`text-sm ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] font-medium text-white hover:opacity-90 disabled:opacity-60 transition-opacity cursor-pointer"
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        {/* Footer note */}
        <p className="text-xs text-slate-500 text-center mt-5">
          🔒 For your security, you'll be asked to login again after resetting your password.
        </p>
      </div>
    </div>
  );
};

export default ResetPassword;