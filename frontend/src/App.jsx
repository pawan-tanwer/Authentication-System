import React, { useContext, useEffect } from "react";
import { Route, Routes } from "react-router-dom";
import Home from "./Pages/Home";

import Features from "./Pages/Features";
import Security from "./Pages/Security";
import About from "./Pages/About";
import Navbar from "./components/home/Navbar";
import Footer from "./components/Footer";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import VerifyEmail from "./Pages/VerifyEmail";
import { StoreContext } from "./Context/StoreContext";
import axios from "axios";
import Profile from "./Pages/Profile";
import VerifyUser from "./utils/VerifyUser";
import VerifyForgotPassword from "./Pages/VerifyForgotPassword";
import ResetPassword from "./Pages/ResetPassword";
import ProtectVerifyForgotPassword from "./utils/ProtectVerifyForgotPassword";
import ProtectResetPassword from "./utils/ProtectResetPassword";

const App = () => {
  const {
    setIsAuthentication,
    authUrl,
    setAccessToken,
    accessToken,
    setUser,
    user,
  } = useContext(StoreContext);
  useEffect(() => {
    const checkAuth = async () => {
      try {
        console.log("before");
        const { data } = await axios.post(
          `${authUrl}/refresh-token`,
          {},
          {
            withCredentials: true,
          },
        );
        console.log("response :", data);
        if (data.success) {
          setAccessToken(data.accessToken);
          setUser(data.userData);
          setIsAuthentication(true);
        }
      } catch (error) {
        console.log("ERROR:", error);
        console.log("STATUS:", error.response?.status);
        console.log("DATA:", error.response?.data);
        setIsAuthentication(false); 
      }
    };
    checkAuth();
    const interval = setInterval(
      () => {
        checkAuth();
      },
      14 * 60 * 1000,
    ); // 14 minutes (access token expire hone se 1 min pehle)

    return () => clearInterval(interval);
  }, []);

  return (
    <div className=" bg-gray-950  text-amber-50">
      <Navbar />
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
        theme="dark"
      />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/verify-email" element={<VerifyEmail />}/>
        <Route path="/features" element={<Features />} />
        <Route path="/security" element={<Security />} />
        <Route path="/about" element={<About />} />
        <Route element={<ProtectVerifyForgotPassword />}>
          <Route path="/verify-forgot-password" element={<VerifyForgotPassword />} />
        </Route>
        <Route element={<ProtectResetPassword />}>
          <Route path="/reset-password" element={<ResetPassword />} />
        </Route>
        <Route element={<VerifyUser />}>
          <Route path="/profile" element={<Profile />} />
        </Route>
      </Routes>
      <Footer />
    </div>
  );
};

export default App;
