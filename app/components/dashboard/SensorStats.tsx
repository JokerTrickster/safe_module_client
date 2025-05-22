import React from 'react';
import { Sensor } from '../../types';
import { Lightbulb, Flame, AlertTriangle } from 'lucide-react';

interface SensorStatsProps {
  sensors: Sensor[];
}

const SensorStats: React.FC<SensorStatsProps> = ({ sensors }) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 mt-4">
      <h2 className="text-lg font-bold text-black mb-2">센서 전체 현황</h2>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-4 py-2 font-semibold text-gray-700">센서 ID</th>
              <th className="px-4 py-2 font-semibold text-gray-700">조명 상태</th>
              <th className="px-4 py-2 font-semibold text-gray-700">화재감지</th>
              <th className="px-4 py-2 font-semibold text-gray-700">CO₂ (ppm)</th>
              <th className="px-4 py-2 font-semibold text-gray-700">CO (ppm)</th>
            </tr>
          </thead>
          <tbody>
            {sensors.map(sensor => {
              const co2 = sensor.sensors.find(s => s.name === 'co2');
              const co = sensor.sensors.find(s => s.name === 'co');
              return (
                <tr
                  key={sensor.id}
                  className={
                    (sensor.fireDetector === 'detection'
                      ? 'bg-red-50 animate-pulse'
                      : '') +
                    ' border-b last:border-b-0'
                  }
                >
                  <td className="px-4 py-2 font-mono text-xs text-gray-800">
                    {sensor.sensor_id.slice(-2)}
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <Lightbulb
                        size={18}
                        className={
                          sensor.lightStatus === 'normal'
                            ? 'text-yellow-500'
                            : 'text-gray-400'
                        }
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center justify-center">
                      <Flame
                        size={18}
                        className={
                          sensor.fireDetector === 'detection'
                            ? 'text-red-600 animate-pulse'
                            : 'text-gray-400'
                        }
                      />
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {co2 && co2.value >= 3000 && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                      <span
                        className={
                          co2
                            ? co2.value >= 3000
                              ? 'text-red-600 font-bold'
                              : co2.value >= 2400
                              ? 'text-yellow-600 font-semibold'
                              : 'text-black'
                            : 'text-gray-400'
                        }
                      >
                        {co2 ? co2.value : '-'}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2">
                    <div className="flex items-center gap-1">
                      {co && co.value >= 500 && (
                        <AlertTriangle size={16} className="text-red-500" />
                      )}
                      <span
                        className={
                          co
                            ? co.value >= 500
                              ? 'text-red-600 font-bold'
                              : co.value >= 400
                              ? 'text-yellow-600 font-semibold'
                              : 'text-black'
                            : 'text-gray-400'
                        }
                      >
                        {co ? co.value : '-'}
                      </span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default SensorStats; 