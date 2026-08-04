import React from "react";
import { MdLock } from "react-icons/md";
import { HiUserGroup } from "react-icons/hi";
import { HiShieldCheck } from "react-icons/hi2";
import { FaBolt, FaCode, FaLock, FaChartLine } from "react-icons/fa6";
import { GiTargetArrows } from "react-icons/gi";

const stats = [
  { id: 1, icon: HiUserGroup, value: "10K+", label: "Developers Trust Us" },
  { id: 2, icon: HiShieldCheck, value: "99.99%", label: "Uptime" },
  { id: 3, icon: FaBolt, value: "1M+", label: "Authentications / Day" },
];

const missionPoints = [
  { id: 1, icon: FaCode, label: "Developer Friendly" },
  { id: 2, icon: FaLock, label: "Highly Secure" },
  { id: 3, icon: FaChartLine, label: "Scalable Solution" },
];

const About = () => {
  return (
    <section className="w-full bg-gradient-to-br from-[#081120] zvia-[#0D1633] to-[#141B3A] text-white px-4 sm:px-6 md:px-10 lg:px-20 py-12 md:py-16 lg:py-20">
      <div className="max-w-6xl mx-auto flex flex-col gap-12 lg:gap-16">
        {/* Top: text + illustration */}
        <div className="flex flex-col-reverse lg:flex-row items-center gap-10 lg:gap-16">
          {/* Left: text content */}
          <div className="w-full lg:w-1/2 flex flex-col gap-5 sm:gap-6">
            <p className="inline-flex w-fit items-center gap-2 text-xs sm:text-sm text-slate-200 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full px-3 py-1.5">
              <MdLock className="text-sm" />
              About Us
            </p>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight">
              Building Trust in a{" "}
              <span className="bg-gradient-to-r from-[#5C93FF] to-[#B24BFA] bg-clip-text text-transparent">
                Digital World.
              </span>
            </h2>

            <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
              SecureAuth was created to simplify authentication while
              maintaining the highest standards of security and user
              experience.
            </p>

            <div className="flex flex-wrap gap-6 sm:gap-8 mt-2">
              {stats.map(({ id, icon: Icon, value, label }) => (
                <div key={id} className="flex items-center gap-3">
                  <div className="p-2.5 rounded-full bg-indigo-600/20 text-indigo-400 text-lg shrink-0">
                    <Icon />
                  </div>
                  <div>
                    <p className="text-lg sm:text-xl font-bold leading-tight">
                      {value}
                    </p>
                    <p className="text-xs sm:text-sm text-gray-400 whitespace-nowrap">
                      {label}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: illustration */}
          <div className="w-full lg:w-1/2 flex justify-center">
            <img
              src="/about_page.png"
              alt="Team collaborating on secure authentication"
              className="w-full h-auto object-contain [mask-image:radial-gradient(ellipse_60%_60%_at_center,black_50%,transparent_90%)] [-webkit-mask-image:radial-gradient(ellipse_60%_60%_at_center,black_50%,transparent_90%)]"
            />
          </div>
        </div>

        {/* Mission card */}
        <div className="w-full rounded-2xl border border-white/10 bg-white/[0.03] p-6 sm:p-8 md:p-10 flex flex-col gap-6">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 text-center sm:text-left">
            <div className="p-4 rounded-full bg-indigo-600/10 text-indigo-400 text-3xl shrink-0">
              <GiTargetArrows />
            </div>
            <div>
              <h3 className="text-xl sm:text-2xl font-bold mb-2">
                Our Mission
              </h3>
              <p className="text-sm sm:text-base text-gray-300 leading-relaxed">
                Our mission is to provide developers with a secure, reliable,
                and easy-to-integrate authentication solution that helps them
                focus on building amazing products.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row flex-wrap gap-3 sm:gap-4 justify-center sm:justify-start">
            {missionPoints.map(({ id, icon: Icon, label }) => (
              <div
                key={id}
                className="flex items-center justify-center gap-2 border border-white/10 bg-white/[0.03] rounded-xl px-4 sm:px-5 py-2.5 sm:py-3 text-sm sm:text-base font-medium"
              >
                <Icon className="text-indigo-400" />
                <span className="whitespace-nowrap">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;