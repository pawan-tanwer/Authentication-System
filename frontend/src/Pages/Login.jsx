import React, { useContext, useState } from "react";
import { StoreContext } from "../Context/StoreContext";
import { GoogleLogin } from "@react-oauth/google";
import { MdPassword } from "react-icons/md";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import axios from "axios";

const Login = () => {
  const {
    type,
    setType,
    authUrl,
    setUser,
    setAccessToken,
    setEmail,
    setIsAuthentication,
    setVerifyResetPassword,
    user,
    setProfileImage,
    setAllUsers
  } = useContext(StoreContext);
  const [message, setMessage] = useState({ type: "", text: "" });
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [data, setData] = useState({
    email: "",
    password: "",
  });

  const changeHandler = (e) => {
    const { name, value } = e.target;
    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  const SubmitHandler = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `https://auth-backend-00je.onrender.com/api/auth/login`,
        {
          email: data.email.trim(),
          password: data.password.trim(),
        },
        {
          withCredentials: true,
        },
      );
      if (response.data.success) {
        setUser(response.data.userData);
        setAccessToken(response.data.accessToken);
        setIsAuthentication(true);
        navigate("/");
        toast.success(response?.data?.message);
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to login",
      });
      toast.error(error.response?.data?.message);
    }
  };

  const GoogleLoginHandle = async (credentialResponse) => {
    try {
      const { data } = await axios.post(
        `${authUrl}/google`,
        {
          idToken: credentialResponse.credential,
        },
        {
          withCredentials: true,
        },
      );
      if (data.success) {
        setIsAuthentication(true);
        setUser((prevUser) => ({ ...prevUser, ...data.userData }));
        setAllUsers(data.userData);
        setProfileImage(data.userData.avatar);
        setAccessToken(data.accessToken);
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Google authentication failed",
      );
    }
  };

  const handleForgotPassword = async (e) => {
    e?.preventDefault();
    console.log("forgot password clicked");
    try {
      if (!data.email) {
        toast.error("Please enter your email");
        return;
      }
      const response = await axios.post(
        `${authUrl}/forgot-password`,
        { email: data.email.trim() },
        { withCredentials: true },
      );
      if (response.data.success) {
        setVerifyResetPassword(true);
        setEmail(data.email.trim());
        toast.success(response.data.message);
        navigate("/verify-forgot-password");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };
  return (
    <form className="w-full max-w-md h-auto p-10 flex flex-col items-center gap-6 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-2xl bg-[#090D16]">
      <div className="flex w-full flex-col items-center">
        <img src={`/logo.png`} className="h-12 " alt="" />
        <h3 className="text-2xl font-bold">Welcome Back!</h3>
        <p className="text-sm lg:text-lg text-gray-500">
          Login to continue your journey
        </p>
      </div>
      <div className="flex flex-col h-auto gap-2 w-full">
        <input
          type="email"
          name="email"
          onChange={changeHandler}
          value={data.email}
          placeholder="Enter your Email"
          className="placeholder:text-sm rounded-xl bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all py-3 px-4"
        />
        <div className="relative">
          <input
          type={showPassword ? "text" : "password"}
          name="password" 
          onChange={changeHandler}
          value={data.password}
          placeholder="Enter your password"
          className="placeholder:text-sm w-full rounded-xl bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all py-3 px-4"
        />
        <span
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white transition-colors"
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </span>
        </div>
      </div>
      <div className="flex items-center justify-between w-full">
        <div className="flex gap-1 items-center">
          <input type="checkbox" />
          <p>remember me</p>
        </div>
        <p
          onClick={handleForgotPassword}
          className="text-purple-500 cursor-pointer"
        >
          Forgot password?
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
      <button
        onClick={SubmitHandler}
        className="w-full py-3 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] font-medium text-white hover:opacity-90 transition-opacity active:bg-gray-950 cursor-pointer"
      >
        Login
      </button>
      <div className="flex items-center w-full gap-3 px-3">
        <div className="flex-1 h-[1px] bg-gray-600"></div>
        <p className="text-sm text-gray-300  whitespace-nowrap">
          or continue with
        </p>
        <div className="flex-1 h-[1px] bg-gray-600"></div>
      </div>
      <GoogleLogin
        type="button"
        onSuccess={GoogleLoginHandle}
        className="cursor-pointer"
      ></GoogleLogin>

      <div className="flex gap-3">
        <p>Don't have an account?</p>
        <p
          className="text-purple-500 cursor-pointer"
          onClick={() => setType("Register")}
        >
          {type == "Login" ? "Register" : "Login"}
        </p>
      </div>
    </form>
  );
};

export default Login;
