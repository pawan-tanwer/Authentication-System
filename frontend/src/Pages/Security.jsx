import React from "react";
import { MdSecurity } from "react-icons/md";
import { FaCheck } from "react-icons/fa6";

const securityFeatures = [
  "JWT Authentication",
  "Refresh Token Rotation",
  "Multi Device Sessions",
  "Google OAuth",
  "Email OTP Verification",
  "RBAC",
  "Protected Routes",
  "HttpOnly Cookies",
  "Password Hashing",
  "Rate Limiting",
  "Helmet Security Headers",
  "Input Validation",
  "CORS Configuration",
  "Environment Variables",
  "Secure Logout (Single + All Devices)",
];

const Security = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#081120] zvia-[#0D1633] to-[#141B3A] text-white px-4 sm:px-6 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20">
      <div className="max-w-5xl mx-auto flex flex-col gap-10">
        {/* Header */}
        <div className="flex flex-col items-center text-center gap-4">
          <p className="inline-flex w-fit items-center gap-2 text-xs sm:text-sm text-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1.5">
            <MdSecurity className="text-sm" />
            Security
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Built with{" "}
            <span className="bg-gradient-to-r from-[#5C93FF] to-[#B24BFA] bg-clip-text text-transparent">
              Security First
            </span>
          </h2>
          <p className="text-sm sm:text-base text-gray-300 max-w-xl">
            Every layer of this authentication system follows industry best
            practices to keep users and applications safe.
          </p>
        </div>

        {/* Feature grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
          {securityFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-center gap-3 border border-white/10 bg-white/[0.03] rounded-xl px-4 sm:px-5 py-3.5 sm:py-4 hover:border-blue-500/40 hover:bg-white/[0.06] transition-all duration-300"
            >
              <span className="shrink-0 p-1.5 rounded-full bg-green-600/20 text-green-500 text-sm">
                <FaCheck />
              </span>
              <span className="text-sm sm:text-base font-medium">
                {feature}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Security;