import React from "react";

export function CircularGauge({ value, size = 200, strokeWidth = 12, label = "Level" }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className="relative flex flex-col items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90 transition-all duration-700 ease-out"
      >
        {/* Background Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="currentColor"
          strokeWidth={strokeWidth}
          fill="transparent"
          className="text-slate-100"
        />
        {/* Progress Circle with Gradient */}
        <defs>
          <linearGradient id="gaugeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#06b6d4" /> {/* lagoon-like */}
            <stop offset="100%" stopColor="#0891b2" />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#gaugeGradient)"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={circumference}
          style={{ strokeDashoffset: offset }}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-in-out"
        />
      </svg>

      {/* Percentage Text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-display text-4xl font-bold text-ink">
          {Math.round(value)}%
        </span>
        <span className="text-xs uppercase tracking-widest text-slate-400 font-medium mt-1">
          {label}
        </span>
      </div>
    </div>
  );
}

export function StatsCard({ title, value, icon: Icon, colorClass = "text-lagoon", bgClass = "bg-spray/20" }) {
  return (
    <div className="flex items-center gap-4 rounded-[28px] border border-slate-100 bg-white p-6 shadow-sm transition hover:shadow-md">
      <div className={`flex h-12 w-12 items-center justify-center rounded-2xl ${bgClass}`}>
        <Icon className={colorClass} size={24} />
      </div>
      <div>
        <p className="text-xs font-semibold uppercase tracking-widest text-slate-400">
          {title}
        </p>
        <p className="mt-1 text-2xl font-bold text-ink">
          {value}
        </p>
      </div>
    </div>
  );
}
