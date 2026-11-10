import React, { useState, useRef, useEffect, useContext } from "react";
import axios from "axios";
import { MdOutlineMail, MdOutlineVerified } from "react-icons/md";
import { HiOutlineShieldCheck } from "react-icons/hi";
import { IoHeadsetOutline } from "react-icons/io5";
import { HiOutlineLockClosed } from "react-icons/hi2";
import { StoreContext } from "../../Context/StoreContext";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const ChangeEmailOtp = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(45);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  const inputRefs = useRef([]);
  const {email,userUrl,accessToken,setActive} = useContext(StoreContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.every((char) => /^[0-9]$/.test(char))) {
      setOtp(pasteData.concat(Array(6 - pasteData.length).fill("")));
      inputRefs.current[pasteData.length - 1]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setMessage({ type: "", text: "" });
      const response = await axios.post(
        `${userUrl}/change-email`,
        {newEmail:email },
        { withCredentials: true,
          headers: {
        Authorization: `Bearer ${accessToken}`
      }
         }
      );
      if(response.data.success){
        toast.success(response.data.message);
      }
      setTimer(45);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to resend OTP",
      });
    }
  };

  const handleVerify = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      setMessage({ type: "error", text: "Please enter the complete 6-digit code" });
      return;
    }

    try {
      setLoading(true);
      setMessage({ type: "", text: "" });

      const { data } = await axios.post(
        "https://auth-backend-00je.onrender.com/api/user/verify-email-otp",
        { newEmail:email, otp: finalOtp },
        { withCredentials: true,
          headers: {
        Authorization: `Bearer ${accessToken}`
      }
         }
      );

      if (data.success) {
        setMessage({ type: "success", text: data.message });
        toast.success(data.message)
        setActive("Profile")
      } else {
        setMessage({ type: "error", text: data.message });
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Something went wrong",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen rounded-2xl bg-[#0A0E1A] flex justify-center items-start p-8">
      <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-6">
        {/* LEFT: Verify OTP Card */}
        <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-8">
          <div className="flex items-center gap-4 mb-2">
            <div className="h-10 w-14 rounded-full bg-amber-500/15 border border-amber-500/30 flex items-center justify-center">
              <MdOutlineMail className="text-amber-400 text-2xl" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-amber-400">Verify OTP</h2>
              <p className="text-sm text-slate-400">
                We have sent a 6-digit OTP to your new email address. Please
                enter the OTP below to verify your email.
              </p>
            </div>
          </div>

          <hr className="border-slate-800 my-5" />

          <p className="text-sm text-slate-300 mb-2">New Email Address</p>
          <div className="flex items-center justify-between bg-[#161C2C] border border-slate-700 rounded-xl px-4 py-3 mb-6">
            <div className="flex items-center gap-2 text-slate-200">
              <MdOutlineMail className="text-slate-400" />
              <span>{email}</span>
            </div>
          </div>

          <p className="text-sm text-slate-300 mb-2">Enter 6-digit OTP</p>
          <div className="flex gap-3 mb-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                ref={(el) => (inputRefs.current[index] = el)}
                onChange={(e) => handleChange(e, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-lg rounded-lg bg-[#161C2C] border border-slate-700 text-white focus:outline-none focus:border-indigo-500 transition-all"
              />
            ))}
          </div>
          <p className="text-xs text-slate-500 mb-5">
            Please enter the 6-digit code sent to your email.
          </p>

          <div className="flex items-start gap-2 bg-[#12182A] border border-slate-800 rounded-xl px-4 py-3 mb-6 text-sm text-slate-400">
            <span className="mt-0.5">ⓘ</span>
            <p>
              OTP is valid for 5 minutes. If you didn't receive the email,
              check your spam folder.
            </p>
          </div>

          {message.text && (
            <p
              className={`text-sm mb-4 ${
                message.type === "success" ? "text-green-400" : "text-red-400"
              }`}
            >
              {message.text}
            </p>
          )}

          <div className="flex items-center gap-6 mb-6">
            <button
              onClick={handleVerify}
              disabled={loading}
              className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white px-5 py-2.5 rounded-lg font-medium transition-colors"
            >
              <MdOutlineVerified />
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            {timer > 0 ? (
              <span className="text-sm text-indigo-400">
                Resend OTP ({formatTime(timer)})
              </span>
            ) : (
              <button
                onClick={handleResend}
                className="text-sm text-indigo-400 hover:underline cursor-pointer"
              >
                Resend OTP
              </button>
            )}
          </div>

          <hr className="border-slate-800 mb-4" />

          <div className="flex items-center gap-2 text-xs text-slate-500">
            <HiOutlineLockClosed />
            <span>Your new email will be updated only after successful verification.</span>
          </div>
        </div>

        {/* RIGHT: Info panels */}
        <div className="flex flex-col gap-6">
          {/* Illustration placeholder */}
          <div className="bg-[#0F1420] border border-slate-800 rounded-2xl h-40 flex items-center justify-center">
            <div className="relative">
              <div className="bg-white text-slate-900 font-bold text-lg px-6 py-3 rounded-xl shadow-lg tracking-widest">
                123456
              </div>
              <div className="absolute -bottom-2 -right-2 h-6 w-6 rounded-full bg-green-500 flex items-center justify-center text-white text-xs">
                ✓
              </div>
            </div>
          </div>

          {/* Important box */}
          <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <HiOutlineShieldCheck className="text-indigo-400 text-lg" />
              <h4 className="text-white font-medium">Important</h4>
            </div>
            <p className="text-sm text-slate-400">
              Do not share this OTP with anyone. SecureAuth will never ask for
              your OTP.
            </p>
          </div>

          {/* Need Help box */}
          <div className="bg-[#0F1420] border border-slate-800 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-2">
              <IoHeadsetOutline className="text-green-400 text-lg" />
              <h4 className="text-white font-medium">Need Help?</h4>
            </div>
            <p className="text-sm text-slate-400">
              If you are facing any issues,{" "}
              <a href="#" className="text-indigo-400 hover:underline">
                Contact Support ↗
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangeEmailOtp;