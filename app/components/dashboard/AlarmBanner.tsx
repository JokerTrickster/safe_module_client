import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell } from 'lucide-react';
import SensorModal from './SensorModal';
import { Sensor } from '../../types';

interface AlarmBannerProps {
  onStopAlarm: (sensorId: string) => void;
  dangerSensors: Sensor[];
  onStatusChange: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
}

const AlarmBanner: React.FC<AlarmBannerProps> = ({ onStopAlarm, dangerSensors, onStatusChange }) => {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAlarms, setActiveAlarms] = useState<Set<string>>(new Set());

  // 위험 상태인 센서가 추가되면 자동으로 알람 활성화
  useEffect(() => {
    // danger 상태인 센서 id만 추출해서 한 번만 setState
    const dangerIds = new Set(dangerSensors.filter(sensor => sensor.status === 'danger').map(sensor => sensor.id));
    setActiveAlarms(dangerIds);
  }, [dangerSensors]);

  // 확인 버튼 클릭 시 모달 오픈
  const handleClick = (sensorId: string) => {
    const sensor = dangerSensors.find(s => s.id === sensorId);
    if (sensor) {
      setSelectedSensor(sensor);
      setIsModalOpen(true);
    }
  };

  // 모달에서 비상벨 Off 시 알람배너만 사라지게 (setTimeout으로 분리)
  const handleAlarmToggle = (sensorId: string, isActive: boolean) => {
    setActiveAlarms(prev => {
      const newSet = new Set(prev);
      if (isActive) {
        newSet.add(sensorId);
      } else {
        newSet.delete(sensorId);
      }
      return newSet;
    });
    if (!isActive) {
      setTimeout(() => {
        onStopAlarm(sensorId);
      }, 0);
    }
  };

  // X 버튼 클릭 시 알람배너 닫기 (setTimeout으로 분리)
  const handleCloseAlarm = (sensorId: string) => {
    setActiveAlarms(prev => {
      const newSet = new Set(prev);
      newSet.delete(sensorId);
      return newSet;
    });
    setTimeout(() => {
      onStopAlarm(sensorId);
    }, 0);
  };

  // 활성화된 알람이 있는 센서만 표시
  const visibleSensors = dangerSensors.filter(sensor =>
    activeAlarms.has(sensor.id) && sensor.status === 'danger'
  );

  if (visibleSensors.length === 0) return null;

  return (
    <>
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
        {visibleSensors.map((sensor) => (
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
                        sensor.type === 'co2' ? '이산화탄소' :
                        sensor.type === 'co' ? '일산화탄소' : sensor.type} 센서 위험 감지
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
                  onClick={() => handleCloseAlarm(sensor.id)}
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

      {selectedSensor && (
        <SensorModal
          sensor={selectedSensor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={onStatusChange}
          onAlarmToggle={handleAlarmToggle}
        />
      )}
    </>
  );
};

export default AlarmBanner; 