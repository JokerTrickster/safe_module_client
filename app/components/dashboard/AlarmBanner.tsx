import React from 'react';
import { AlertTriangle, X, Bell } from 'lucide-react';

interface AlarmBannerProps {
  onStopAlarm: (sensorId: string) => void;
  dangerSensors: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

const AlarmBanner: React.FC<AlarmBannerProps> = ({ onStopAlarm, dangerSensors }) => {
  const handleClick = (sensorId: string) => {
    console.log(`Alarm stop button clicked for sensor ${sensorId}`);
    onStopAlarm(sensorId);
  };

  if (dangerSensors.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
      {dangerSensors.map((sensor) => (
        <div
          key={sensor.id}
          className="bg-white border-l-4 border-red-500 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <div className="relative">
                  <Bell className="h-6 w-6 text-red-500 animate-pulse" />
                  <span className="absolute -top-1 -right-1 h-3 w-3 bg-red-500 rounded-full animate-ping"></span>
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">
                  {sensor.name}
                </h3>
                <div className="mt-1">
                  <p className="text-sm text-gray-600">
                    {sensor.type === 'temperature' ? '온도' : 
                     sensor.type === 'humidity' ? '습도' : 
                     sensor.type === 'pressure' ? '압력' : sensor.type} 센서 위험 감지
                  </p>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleClick(sensor.id)}
                className="inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
              >
                확인
              </button>
              <button
                onClick={() => handleClick(sensor.id)}
                className="text-gray-400 hover:text-gray-500 focus:outline-none"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>
          <div className="mt-2">
            <div className="w-full bg-gray-200 rounded-full h-1">
              <div className="bg-red-500 h-1 rounded-full animate-pulse"></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default AlarmBanner; 