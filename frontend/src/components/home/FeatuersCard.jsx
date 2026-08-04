const FeatuersCard = ({ icon: Icon, iconBg, iconColor, title, description }) => {
  return (
    <div className="w-full rounded-2xl border border-white/10
      bg-white/[0.03] px-4 sm:px-6 py-6 sm:py-8
      flex flex-col items-center text-center
      transition-all duration-300
      hover:-translate-y-1 hover:border-blue-500/40 hover:bg-white/[0.06]">

      {/* Icon */}
      <div className={`p-3 sm:p-4 rounded-full flex items-center
        justify-center text-lg sm:text-xl ${iconBg} ${iconColor}`}>
        <Icon />
      </div>

      {/* Title */}
      <h3 className="mt-4 sm:mt-5 text-sm sm:text-md font-semibold text-white">
        {title}
      </h3>

      {/* Description */}
      <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-6 text-gray-300">
        {description}
      </p>
    </div>
  );
};

export default FeatuersCard;