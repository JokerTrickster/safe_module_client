import React, { useState, useEffect } from 'react';
import { AlertTriangle, X, Bell } from 'lucide-react';
import SensorModal from './SensorModal';
import { Sensor } from '../../api/sensors/types';
import { useSensors } from '@/hooks/useSensors';


interface AlarmBannerProps {
  sensors: Sensor[];
  onStopAlarm: (sensorId: string) => void;
  dangerSensors: Sensor[];
  onStatusChange: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
}


const AlarmBanner: React.FC<AlarmBannerProps> = ({ sensors, onStopAlarm, dangerSensors, onStatusChange }) => {
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [activeAlarms, setActiveAlarms] = useState<Set<string>>(new Set());
  const [audioInitialized, setAudioInitialized] = useState(false);
  const { thresholds} = useSensors();
  const co2Threshold = thresholds.find(t => t.name === 'co2')?.threshold ?? 3000;
  const coThreshold = thresholds.find(t => t.name === 'co')?.threshold ?? 500;
  
  // 위험 상태인 센서가 추가되면 자동으로 알람 활성화
  useEffect(() => {
    const dangerIds = new Set(
      dangerSensors
        .filter(sensor => 
          sensor.status === 'danger' || 
          sensor.fireDetector === 'detection' ||
          sensor.lightStatus === 'error' ||
          (sensor.sensors.some(s => 
            (s.name === 'co2' && s.value >= co2Threshold) || 
            (s.name === 'co' && s.value >= coThreshold)
          ))
        )
        .map(sensor => sensor.id)
    );
    
    // 기존 activeAlarms에 새로운 위험 센서들을 추가
    setActiveAlarms(prev => {
      const newSet = new Set(prev);
      dangerIds.forEach(id => newSet.add(id));
      return newSet;
    });
  }, [dangerSensors, co2Threshold, coThreshold]);

  useEffect(() => {
    const initAudio = () => {};
    document.addEventListener('click', initAudio, { once: true });
    return () => {
      document.removeEventListener('click', initAudio);
    };
  }, []);

  const handleClick = (sensorId: string) => {
    const sensor = dangerSensors.find(s => s.id === sensorId);
    if (sensor) {
      setSelectedSensor(sensor);
      setIsModalOpen(true);
    }
  };

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

  const handleCloseAlarm = (sensorId: string) => {
    setActiveAlarms(prev => {
      const newSet = new Set(prev);
      newSet.delete(sensorId);
      return newSet;
    });
    onStopAlarm(sensorId);
  };

  const visibleSensors = dangerSensors.filter(sensor =>
    activeAlarms.has(sensor.id) && (
      sensor.status === 'danger' || 
      sensor.fireDetector === 'detection' ||
      sensor.lightStatus === 'error' ||
      (sensor.sensors.some(s => 
        (s.name === 'co2' && s.value >= co2Threshold) || 
        (s.name === 'co' && s.value >= coThreshold)
      ))
    )
  );

  const getSensorShortName = (sensorId: string) => sensorId.slice(-2);

  if (visibleSensors.length === 0) return null;

  return (
    <>
      <div className={
        `fixed top-20 right-8 z-50 space-y-2 max-w-md w-full flex flex-col items-end`
      }>
        {visibleSensors.map((sensor) => {
          const co2 = sensor.sensors.find(s => s.name === 'co2');
          const co = sensor.sensors.find(s => s.name === 'co');
          const co2Danger = co2 && co2.value >= co2Threshold;
          const coDanger = co && co.value >= coThreshold;
          const fireDetected = sensor.fireDetector === 'detection';
          const lightDanger = sensor.lightStatus === 'error';
          const isRedBanner = fireDetected || co2Danger || coDanger;
          return (
            <div
              key={sensor.id}
              className={`
                flex flex-row items-center gap-2 w-full max-w-md px-3 py-2 rounded-xl shadow-2xl border-4
                ${isRedBanner ? 'bg-red-100 border-red-500' : 'bg-yellow-100 border-yellow-400'}
                transition-all duration-300
              `}
            >
              <div className={`flex items-center justify-center h-8 w-8 rounded-full bg-white border-2 border-gray-200 shadow mr-2 animate-pulse`}>
                <Bell className={`h-5 w-5 ${isRedBanner ? 'text-red-500' : 'text-yellow-500'}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-lg font-bold ${isRedBanner ? 'text-red-600' : 'text-yellow-700'}`}>센서 {getSensorShortName(sensor.id)}</span>
                  {fireDetected && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-semibold">화재 감지</span>}
                  {co2Danger && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-semibold">CO₂ 위험</span>}
                  {coDanger && <span className="ml-2 px-2 py-0.5 rounded bg-red-100 text-red-600 text-xs font-semibold">CO 위험</span>}
                </div>
                <div className="text-red-700 text-sm mb-1">
                  {fireDetected
                    ? '화재가 감지되었습니다! 즉시 확인하세요.'
                    : co2Danger && coDanger
                    ? '이산화탄소와 일산화탄소 농도가 모두 위험 수준입니다.'
                    : co2Danger
                    ? '이산화탄소 농도가 위험 수준입니다.'
                    : coDanger
                    ? '일산화탄소 농도가 위험 수준입니다.'
                    : '센서 위험 감지'}
                </div>
                <div className="w-full bg-gray-200 rounded-full h-1 mt-2">
                  <div 
                    className={`h-1 rounded-full animate-pulse ${isRedBanner ? 'bg-red-500' : 'bg-yellow-500'}`}
                    style={{ width: '100%' }}
                  ></div>
                </div>
              </div>
              <div className="flex flex-col gap-2 items-end ml-4">
                <button
                  onClick={() => handleClick(sensor.id)}
                  className={`px-5 py-2 rounded-lg text-white font-bold shadow transition-colors text-base
                    ${isRedBanner ? 'bg-red-600 hover:bg-red-700' : 'bg-yellow-500 hover:bg-yellow-600'}`}
                >
                  확인
                </button>
                <button
                  onClick={() => handleCloseAlarm(sensor.id)}
                  className={`text-${isRedBanner ? 'red' : 'gray'}-400 hover:text-${isRedBanner ? 'red' : 'gray'}-600 p-1 rounded-full focus:outline-none`}
                  aria-label="알람 닫기"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {selectedSensor && (
        <SensorModal
          sensors={dangerSensors}
          sensor={selectedSensor}
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onStatusChange={onStatusChange}
          thresholds={thresholds}
        />
      )}
    </>
  );
};

export default AlarmBanner; 