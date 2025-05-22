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
  const [audioInitialized, setAudioInitialized] = useState(false);

  // 위험 상태인 센서가 추가되면 자동으로 알람 활성화
  useEffect(() => {
    // danger 상태이거나 화재 감지된 센서 id만 추출
    const dangerIds = new Set(
      dangerSensors
        .filter(sensor => 
          sensor.status === 'danger' || 
          sensor.fireDetector === 'detection' ||
          (sensor.sensors.some(s => 
            (s.name === 'co2' && s.value >= 3000) || 
            (s.name === 'co' && s.value >= 500)
          ))
        )
        .map(sensor => sensor.id)
    );
    setActiveAlarms(dangerIds);
  }, [dangerSensors]);

  useEffect(() => {
    const initAudio = () => {
      // ... audio.play() ...
    };
    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
    };
  }, []);

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
    activeAlarms.has(sensor.id) && (
      sensor.status === 'danger' || 
      sensor.fireDetector === 'detection' ||
      (sensor.sensors.some(s => 
        (s.name === 'co2' && s.value >= 3000) || 
        (s.name === 'co' && s.value >= 500)
      ))
    )
  );

  // Utility to get last two characters of sensor_id
  const getSensorShortName = (sensorId: string) => sensorId.slice(-2);

  if (visibleSensors.length === 0) return null;

  return (
    <>
      <div className="fixed top-20 right-4 z-50 space-y-2 max-w-md">
        {visibleSensors.map((sensor) => {
          const co2 = sensor.sensors.find(s => s.name === 'co2');
          const co = sensor.sensors.find(s => s.name === 'co');
          const co2Danger = co2 && co2.value >= 3000;
          const coDanger = co && co.value >= 500;
          const fireDetected = sensor.fireDetector === 'detection';

          return (
            <div
              key={sensor.id}
              className={`
                bg-white border-l-4 p-4 rounded-lg shadow-lg transform transition-all duration-300 hover:scale-105
                ${fireDetected ? 'border-red-500' : 'border-yellow-500'}
              `}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0">
                    <div className="relative">
                      <Bell className={`h-6 w-6 ${fireDetected ? 'text-red-500' : 'text-yellow-500'} animate-pulse`} />
                      <span className={`absolute -top-1 -right-1 h-3 w-3 ${fireDetected ? 'bg-red-500' : 'bg-yellow-500'} rounded-full animate-ping`}></span>
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900" aria-label={`센서 ${getSensorShortName(sensor.id)}`}
                      tabIndex={0}
                    >
                      {getSensorShortName(sensor.id)}
                    </h3>
                    <div className="mt-1">
                      <p className="text-sm text-gray-600">
                        {fireDetected 
                          ? '화재 감지!'
                          : co2Danger 
                            ? '이산화탄소 위험 수준'
                            : coDanger 
                              ? '일산화탄소 위험 수준'
                              : '센서 위험 감지'}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleClick(sensor.id)}
                    className={`
                      inline-flex items-center px-3 py-1.5 border border-transparent text-xs font-medium rounded-md text-white
                      ${fireDetected ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-600 hover:bg-yellow-700'}
                      focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200
                    `}
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
                  <div 
                    className={`h-1 rounded-full animate-pulse ${
                      fireDetected ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                  ></div>
                </div>
              </div>
            </div>
          );
        })}
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