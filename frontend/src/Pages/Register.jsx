import React, { useContext, useState } from "react";
import { StoreContext } from "../Context/StoreContext";
import { toast } from "react-toastify";
import axios from "axios";
import { GoogleLogin } from "@react-oauth/google";
import { useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Register = () => {
  const {
    type,
    setType,
    authUrl,
    setEmail,
    setAccessToken,
    setIsAuthentication,
  } = useContext(StoreContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [data, setData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    setData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!data.name.trim()) {
      toast.error("Name is required");
      return;
    }

    if (data.password.length < 8) {
      toast.warning("Password must be at least 8 characters");
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("ConfirmPassword do not match");
      return;
    }
    try {
      setLoading(true);
      const response = await axios.post(
        `${authUrl}/register`,
        {
          name: data.name,
          email: data.email,
          password: data.password,
        },
        { withCredentials: true },
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setData({
          name: "",
          email: "",
          password: "",
          confirmPassword: "",
        });
        setEmail(data.email);
        navigate("/verify-email");
      }
    } catch (error) {
      setLoading(false);
      console.error(error);
      toast.error(error.response?.data?.message || "Registration failed");
    }finally{
      setLoading(false);
    }
  };

  const GoogleRegisterHandle = async (credentialResponse) => {
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
        setAccessToken(data.accessToken);
        setIsAuthentication(true);
        toast.success(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Google authentication failed",
      );
    }finally{
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-[878px] max-w-lg h-auto p-10 flex flex-col items-center gap-10 border border-purple-500/20 shadow-[0_0_15px_rgba(168,85,247,0.15)] rounded-2xl bg-[#090D16]"
    >
      <div className="flex w-full flex-col items-center">
        <img src={`/logo.png`} className="h-12 " alt="" />
        <h3 className="text-2xl font-bold">Create Account</h3>
        <p className="text-sm lg:text-lg text-gray-500">
          Register to start your journey
        </p>
      </div>
      <div className="flex flex-col h-auto gap-4 w-full">
        <input
          type="text"
          name="name"
          value={data.name}
          placeholder="Enter your name"
          onChange={onChangeHandler}
          className="rounded-xl bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all py-3 px-4"
        />
        <input
          type="email"
          name="email"
          value={data.email}
          placeholder="Enter your Email"
          onChange={onChangeHandler}
          className="rounded-xl bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all py-3 px-4"
        />
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={data.password}
            placeholder="Enter your password"
            onChange={onChangeHandler}
            className="rounded-xl w-full bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all py-3 px-4"
          />
          <span
            onClick={() => setShowPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white transition-colors"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
        <div className="relative">
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={data.confirmPassword}
            placeholder="Confirm your password"
            onChange={onChangeHandler}
            className="rounded-xl w-full bg-[#0F172A]/50 border border-slate-700/50 text-white placeholder-slate-400 focus:outline-none focus:border-indigo-500/80 transition-all py-3 px-4"
          />
          <span
            onClick={() => setShowConfirmPassword((prev) => !prev)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 cursor-pointer hover:text-white transition-colors"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </span>
        </div>
      </div>

      {loading ? (
        <p className="w-full p-2 text-center rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] font-medium text-white hover:opacity-90 transition-opacity active:bg-gray-950 cursor-pointer">
          Loading...
        </p>
      ) : (
        <button className="w-full p-2 rounded-xl bg-gradient-to-r from-[#4F46E5] to-[#6366F1] font-medium text-white hover:opacity-90 transition-opacity active:bg-gray-950 cursor-pointer">
          Create Account
        </button>
      )}
      <div className="flex items-center w-full gap-3 px-3">
        <div className="flex-1 h-[1px] bg-gray-600"></div>
        <p className="text-sm text-gray-300  whitespace-nowrap">
          or continue with
        </p>
        <div className="flex-1 h-[1px] bg-gray-600"></div>
      </div>
      <GoogleLogin
        onSuccess={GoogleRegisterHandle}
        className="w-full p-3 rounded-lg border border-white/20 
                   bg-white/5 hover:bg-white/10 
                   transition-all duration-200
                   flex items-center justify-center gap-3 cursor-pointer"
      >
        <img src="/google.png" className="size-7" alt="" />
        <span className="text-white font-medium">Continue with Google</span>
      </GoogleLogin>
      <div className="flex gap-3">
        <p>Already have an account?</p>
        <p
          className="text-purple-500 cursor-pointer"
          onClick={() => setType("Login")}
        >
          {type == "Login" ? "Register" : "Login"}
        </p>
      </div>
    </form>
  );
};

export default Register;
