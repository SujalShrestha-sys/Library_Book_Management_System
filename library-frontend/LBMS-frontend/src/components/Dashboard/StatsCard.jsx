import React from "react";

const pastelColors = {
  softBlue: "bg-blue-50 text-blue-700",
  softGreen: "bg-green-50 text-green-700",
  softPurple: "bg-purple-50 text-purple-700",
  softPink: "bg-pink-50 text-pink-700",
  softAmber: "bg-amber-50 text-amber-700",
  softTeal: "bg-teal-50 text-teal-700",
  softRed: "bg-red-50 text-red-700",
  softGray: "bg-gray-50 text-gray-700",
};

const StatsCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  color = "softGray",
}) => {
  return (
    <div
      className={`
        rounded-xl p-5 shadow-sm transition-transform transform
        hover:-translate-y-1 hover:shadow-md
        ${pastelColors[color]}
      `}
    >
      {/* Title & Icon */}
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {Icon && <Icon className="w-5 h-5 text-gray-600" />}
      </div>

      {/* Value */}
      <p className="text-2xl font-bold mb-1">{value}</p>

      {/* Subtitle */}
      <p className="text-xs text-gray-500">{subtitle}</p>
    </div>
  );
};

export default StatsCard;
