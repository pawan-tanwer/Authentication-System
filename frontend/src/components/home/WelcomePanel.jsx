import React, { useContext } from "react";
import {
  FaShieldAlt,
  FaUsers,
  FaKey,
  FaRocket,
  FaCheckCircle,
  FaHandSparkles,
} from "react-icons/fa";
import { StoreContext } from "../../Context/StoreContext";

const WelcomePanel = () => {
    const {user}= useContext(StoreContext);
  return (
    <div className="w-full max-w-[520px] rounded-3xl border border-purple-500/20 bg-[#090D16] shadow-[0_0_25px_rgba(139,92,246,0.15)] p-8">

      {/* Top */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full bg-[#141C2F] flex items-center justify-center mb-5">
          <FaHandSparkles className="text-4xl text-yellow-400" />
        </div>

        <h2 className="text-4xl font-bold text-white">
          Hi, {user.name}! 👋
        </h2>

        <p className="text-gray-400 mt-2">
          Welcome back to SecureAuth
        </p>
      </div>

      {/* Intro Card */}
      <div className="mt-8 rounded-2xl border border-purple-500/30 bg-[#121827] p-5 flex gap-4 items-start">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <FaShieldAlt className="text-xl text-purple-400" />
        </div>

        <p className="text-gray-300 leading-7">
          SecureAuth helps you and your applications stay protected with
          modern authentication and enterprise-grade security.
        </p>
      </div>

      {/* Why */}
      <div className="mt-8">
        <h3 className="text-2xl font-semibold text-white">
          Why SecureAuth?
        </h3>

        <div className="w-full h-px bg-gray-700 mt-3 mb-6"></div>

        <div className="space-y-5">

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center">
              <FaShieldAlt className="text-green-400 text-xl" />
            </div>

            <div>
              <h4 className="text-white font-semibold">
                Protect Your Account
              </h4>

              <p className="text-gray-400 text-sm mt-1">
                Industry-standard authentication keeps your account safe.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FaUsers className="text-purple-400 text-xl" />
            </div>

            <div>
              <h4 className="text-white font-semibold">
                Manage Access
              </h4>

              <p className="text-gray-400 text-sm mt-1">
                Role-based permissions for better control.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-500/10 flex items-center justify-center">
              <FaKey className="text-blue-400 text-xl" />
            </div>

            <div>
              <h4 className="text-white font-semibold">
                Seamless Experience
              </h4>

              <p className="text-gray-400 text-sm mt-1">
                Login once and enjoy a smooth, secure experience.
              </p>
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center">
              <FaRocket className="text-orange-400 text-xl" />
            </div>

            <div>
              <h4 className="text-white font-semibold">
                Built for the Future
              </h4>

              <p className="text-gray-400 text-sm mt-1">
                Scalable authentication ready for modern applications.
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* Bottom Card */}
      <div className="mt-8 rounded-2xl bg-[#121827] border border-slate-700 p-5 flex gap-4 items-center">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
          <FaCheckCircle className="text-purple-400 text-xl" />
        </div>

        <div>
          <h4 className="text-white font-semibold">
            You're all set!
          </h4>

          <p className="text-gray-400 text-sm mt-1">
            Your account is secure and ready to use.
          </p>
        </div>
      </div>

    </div>
  );
};

export default WelcomePanel;