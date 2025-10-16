import React from "react";
import { motion } from "framer-motion";

export default function Card({
  title,
  value,
  icon,
  subtitle,
  color = "",
  loading,
}) {
  return (
    <motion.div
      className={`bg-white shadow-md rounded-xl p-5 flex flex-col gap-2 hover:shadow-lg transition border-t-4 ${color}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center gap-2">
        {icon && <span className="text-2xl">{icon}</span>}
        <span className="text-lg font-semibold text-gray-800">{title}</span>
      </div>
      <div className="text-2xl font-bold text-gray-900">
        {loading ? <span className="animate-pulse">...</span> : value}
      </div>
      {subtitle && <div className="text-sm text-gray-500">{subtitle}</div>}
    </motion.div>
  );
}
