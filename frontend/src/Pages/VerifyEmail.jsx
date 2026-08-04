import { useRef, useState, useEffect, useContext } from "react";
import { CiLock } from "react-icons/ci";
import { MdOutlineEmail } from "react-icons/md";
import { StoreContext } from "../Context/StoreContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const VerifyEmail = () => {
  const { email, authUrl, accessToken, setAccessToken, setUser ,setIsAuthentication} =
    useContext(StoreContext);
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(105); // 01:45 = 105 seconds
  const inputRefs = useRef([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;
    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (seconds) => {
    const mins = String(Math.floor(seconds / 60)).padStart(2, "0");
    const secs = String(seconds % 60).padStart(2, "0");
    return `${mins}:${secs}`;
  };

  const handleChange = (e, index) => {
    const value = e.target.value;

    // sirf number allow karo, aur ek hi digit
    if (!/^[0-9]?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // agar value aayi hai to next box par focus karo
    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Backspace pe agar box empty hai, to previous box par focus karo
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    const pasteData = e.clipboardData.getData("text").slice(0, 6).split("");
    if (pasteData.every((char) => /^[0-9]$/.test(char))) {
      setOtp(pasteData.concat(Array(6 - pasteData.length).fill("")));
      const lastIndex = pasteData.length - 1;
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleResend = async () => {
    try {
      setTimer(105);
      setOtp(new Array(6).fill(""));
      inputRefs.current[0].focus();
      const response = await axios.post(
        `${authUrl}/resend-otp`,
        { email },
        { withCredentials: true },
      );
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message || "Something wong");
    }
    // yaha apni resend OTP API call karo
  };

  const handleSubmit = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length < 6) {
      alert("Please enter complete 6-digit code");
      return;
    }
    try {
      setLoading(true);
      const { data } = await axios.post(
        `${authUrl}/verify-email-otp`,
        {
          email,
          otp: finalOtp,
        },
        {
          withCredentials: true,
        },
      );

      if (data.success) {
        setAccessToken(data?.accessToken);
        setUser(data?.userData);
        setIsAuthentication(true)
        navigate("/");
        toast.success(data.message);
      }
    } catch (error) {
      toast.error(error.data.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
    console.log("OTP entered:", finalOtp);
  };
  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-[#081120] zvia-[#0D1633] to-[#141B3A]   flex justify-center items-center">
      <div
        className="bg-[#0F172A]/60 backdrop-blur-md
                  border border-purple-500/20
                  shadow-[0_0_25px_rgba(168,85,247,0.15)] w-lg flex flex-col items-center justify-center gap-3 p-3 rounded-2xl"
      >
        <div className="flex flex-col items-center ">
          <p className="p-2 rounded-full text-indigo-400 bg-indigo-500/10 border border-indigo-500/30">
            <MdOutlineEmail className="size-7" />
          </p>
          <h3 className="sm:text-md md:text-2xl font-bold text-white">
            Verify Your Email
          </h3>
        </div>
        <div className="flex flex-col items-center gap-1 p-1 text-sm text-slate-400">
          <p>We have sent a 6-digit verification code to</p>
          <p className="border-b-2 border-slate-600 text-white">{email}</p>
          <p>Please check you inbox and spam folder</p>
        </div>
        <div
          className="w-full max-w-md p-10 flex flex-col items-center gap-6 border border-purple-500/20 
                    shadow-[0_0_15px_rgba(168,85,247,0.15)]
                    bg-[#090D16] rounded-xl"
        >
          <p className="text-sm text-gray-300 self-start">Enter 6-digit code</p>

          <div className="flex gap-2 w-full justify-between">
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
                className="w-12 h-12 text-center text-lg rounded-xl bg-[#0F172A]/50 border border-slate-700/50 text-white focus:outline-none focus:border-indigo-500/80 transition-all"
              />
            ))}
          </div>

          <div className="text-sm text-gray-400 flex items-center gap-1">
            {timer > 0 ? (
              <>
                <span>⏱ Didn't receive the code?</span>
                <span className="text-purple-400">
                  Resend in {formatTime(timer)}
                </span>
              </>
            ) : (
              <span
                onClick={handleResend}
                className="text-purple-500 cursor-pointer hover:underline"
              >
                Resend code
              </span>
            )}
          </div>

          <button
            type="button"
            onClick={handleSubmit}
            className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] font-medium text-white hover:opacity-90 transition-opacity cursor-pointer"
          >
            Verify
          </button>
        </div>
        <div className="flex gap-1 items-center text-sm text-slate-400">
          <CiLock />
          <p>
            This code will expires in{" "}
            <span className="text-purple-400 font-medium">5 minutes</span> for
            security reasons
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
