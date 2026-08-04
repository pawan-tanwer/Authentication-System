import React from "react";
import {
  FaLock,
  FaGoogle,
  FaBolt,
  FaChartBar,
  FaPuzzlePiece,
  FaSyncAlt,
  FaSignOutAlt,
  FaMobileAlt,
} from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { MdEmail, MdSecurity } from "react-icons/md";

const featureGroups = [
  {
    category: "Authentication",
    items: [
      {
        icon: FaLock,
        title: "Secure Authentication",
        description: "Login with Email, Google OAuth, and JWT authentication.",
      },
      {
        icon: FaGoogle,
        title: "Google Sign-In",
        description: "One-click authentication using Google OAuth.",
      },
      {
        icon: MdEmail,
        title: "Email Verification",
        description: "OTP-based email verification for trusted accounts.",
      },
      {
        icon: HiUserGroup,
        title: "Role-Based Access",
        description: "Control permissions using Admin and User roles.",
      },
    ],
  },
  {
    category: "Session & security",
    items: [
      {
        icon: FaMobileAlt,
        title: "Multi-Device Sessions",
        description: "Stay logged in across multiple devices securely.",
      },
      {
        icon: FaSyncAlt,
        title: "Refresh Tokens",
        description: "Automatic session renewal without frequent logins.",
      },
      {
        icon: MdSecurity,
        title: "Password Security",
        description: "Passwords are encrypted using bcrypt hashing.",
      },
      {
        icon: FaSignOutAlt,
        title: "Smart Logout",
        description: "Logout from one device or every device instantly.",
      },
      {
        icon: FaChartBar,
        title: "Session Management",
        description: "Track and manage active login sessions.",
      },
    ],
  },
  {
    category: "Architecture",
    items: [
      {
        icon: FaBolt,
        title: "Fast REST API",
        description: "Clean Express.js backend with optimized endpoints.",
      },
      {
        icon: FaPuzzlePiece,
        title: "Clean Architecture",
        description: "Organized MVC structure for scalability.",
      },
    ],
  },
];

const Features = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#081120] zvia-[#0D1633] to-[#141B3A]  text-white px-4 sm:px-6 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 sm:gap-16">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <p className="inline-flex w-fit items-center gap-2 text-xs sm:text-sm text-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1.5">
            <MdSecurity className="text-sm" />
            Features
          </p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
            Everything You Need for{" "}
            <span className="bg-gradient-to-r from-[#5C93FF] to-[#B24BFA] bg-clip-text text-transparent">
              Modern Auth
            </span>
          </h2>
        </div>

        {/* Spec sheet groups */}
        <div className="flex flex-col">
          {featureGroups.map((group, gIndex) => (
            <div
              key={group.category}
              className={`flex flex-col md:flex-row gap-4 md:gap-10 py-8 sm:py-10 ${
                gIndex !== 0 ? "border-t border-white/10" : ""
              }`}
            >
              {/* Category label — sticky-feeling left column */}
              <div className="md:w-48 shrink-0">
                <p className="text-xs font-mono uppercase tracking-widest text-indigo-400">
                  {group.category}
                </p>
              </div>

              {/* Items */}
              <div className="flex-1 flex flex-col gap-6 sm:gap-7">
                {group.items.map(({ icon: Icon, title, description }) => (
                  <div key={title} className="flex items-start gap-4">
                    <span className="shrink-0 mt-0.5 text-indigo-400 text-lg">
                      <Icon />
                    </span>
                    <div className="flex flex-col gap-1">
                      <p className="text-base sm:text-lg font-medium text-white">
                        {title}
                      </p>
                      <p className="text-sm text-gray-400 leading-relaxed">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;