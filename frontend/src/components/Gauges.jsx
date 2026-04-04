import React from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';

const Gauges = ({ value, title }) => {
  // Déterminer la couleur selon le niveau
  const getColor = (percent) => {
    if (percent < 20) return '#ef4444'; // Rouge (Critique)
    if (percent < 50) return '#f59e0b'; // Orange (Moyen)
    return '#3b82f6'; // Bleu (Bon niveau)
  };

  return (
    <div className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm border border-gray-100">
      <h3 className="text-gray-700 font-semibold mb-4">{title}</h3>
      <div style={{ width: 160, height: 160 }}>
        <CircularProgressbar
          value={value}
          text={`${value}%`}
          styles={buildStyles({
            pathColor: getColor(value),
            textColor: '#1e3a8a',
            trailColor: '#e5e7eb',
            pathTransitionDuration: 0.5,
          })}
        />
      </div>
    </div>
  );
};

export default Gauges;