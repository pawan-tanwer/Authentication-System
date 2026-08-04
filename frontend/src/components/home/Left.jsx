import React from "react";
import { MdVerifiedUser } from "react-icons/md";
import FeatuersCard from "./FeatuersCard";
import { FaLock } from "react-icons/fa";
import { HiUserGroup } from "react-icons/hi";
import { FaBolt } from "react-icons/fa";

const Left = () => {
  const features = [
    {
      id: 1,
      icon: FaLock,
      iconBg: "bg-blue-600/20",
      iconColor: "text-blue-500",
      title: "Secure & Reliable",
      description: "JWT based authentication with refresh tokens.",
    },
    {
      id: 2,
      icon: HiUserGroup,
      iconBg: "bg-violet-600/20",
      iconColor: "text-violet-500",
      title: "Role Based Access",
      description: "Manage user roles and permissions easily.",
    },
    {
      id: 3,
      icon: FaBolt,
      iconBg: "bg-green-600/20",
      iconColor: "text-green-500",
      title: "Built for Scale",
      description: "Rate limiting and security best practices built-in.",
    },
  ];

  return (
    <div className="w-full flex flex-col justify-center gap-5 py-10 md:py-0 md:min-h-screen">
      {/* Badge */}
      <div>
        <p className="inline-flex gap-2 text-xs sm:text-sm text-slate-200 items-center border border-transparent bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 [background-clip:padding-box,_border-box] [background-origin:border-box] rounded-2xl px-3 py-1.5 w-fit">
          <span>
            <MdVerifiedUser />
          </span>
          Built for Developers
        </p>
      </div>

      {/* Headline */}
      <div>
        <p className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium leading-tight">
          Secure Authentication for a{" "}
          <span className="bg-gradient-to-r from-[#5C93FF] to-[#8E4BFA] bg-clip-text text-transparent">
            Safer Tomorrow
          </span>
        </p>
      </div>

      {/* Subtext */}
      <div>
        <p className="text-base sm:text-lg text-gray-200">
          A modern authentication system with advanced security features to
          protect your applications and users.
        </p>
      </div>

      {/* Feature cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
        {features.map((feature) => (
          <FeatuersCard
            key={feature.id}
            icon={feature.icon}
            iconBg={feature.iconBg}
            iconColor={feature.iconColor}
            title={feature.title}
            description={feature.description}
          />
        ))}
      </div>

      {/* Footer note */}
      <p className="text-xs sm:text-sm flex items-center gap-1 text-gray-300 mt-8 md:mt-14 lg:mt-20">
        <span>
          <MdVerifiedUser />
        </span>
        Your Security, Our Priority
      </p>
    </div>
  );
};

export default Left;