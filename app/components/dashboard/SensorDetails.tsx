import React, { useState, useEffect } from 'react';
import { Sensor, SensorStatus } from '../../api/sensors/types';
import { Lightbulb, Flame, User, Wind } from 'lucide-react';
import styles from '../../styles/components/dashboard.module.css';

interface SensorDetailsProps {
  sensors: Sensor[];
  selectedSensor: (Sensor & { fireDetector?: string }) | null;
  thresholds: { name: string; threshold: number }[];
}

const getValueStatus = (name: string, value: number, thresholds: { name: string; threshold: number }[]) => {
  const threshold = thresholds.find(t => t.name === name);
  if (!threshold) return { label: '정상', color: 'text-green-600' };
  if (value >= threshold.threshold) return { label: '위험', color: 'text-red-600' };
  if (value >= threshold.threshold * 0.8) return { label: '경고', color: 'text-yellow-600' };
  return { label: '정상', color: 'text-green-600' };
};

const SensorDetails: React.FC<SensorDetailsProps> = ({ sensors,selectedSensor, thresholds }) => {
  const [currentSensor, setCurrentSensor] = useState(selectedSensor);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (selectedSensor && sensors.length > 0) {
      const updatedSensor = sensors.find(sensor => sensor.id === selectedSensor.id);
      if (updatedSensor) {
        setCurrentSensor(updatedSensor);
      }
    }
  }, [sensors, selectedSensor]);


  // 센서 상태 한글 변환
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'error':
      case 'danger':
        return 'text-red-600';
      case 'warning':
        return 'text-yellow-600';
      case 'warmup':
        return 'text-blue-600';
      default:
        return 'text-green-600';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'warmup':
        return '부팅중';
      case 'normal':
        return '정상 동작 중';
      case 'error':
        return '오류 발생';
      case 'danger':
        return '위험';
      case 'warning':
        return '경고';
      default:
        return status;
    }
  };

  // 화재감지 상태 한글 변환
  const getFireDetectorText = (status?: string) => {
    switch (status) {
      case 'detection':
        return '화재 감지';
      case 'normal':
      default:
        return '정상';
    }
  };

  // 조명 상태 한글 변환
  const getLightStatusText = (status?: string) => {
    switch (status) {
      case 'shutdown':
        return '조명 꺼짐';
      case 'normal':
      default:
        return '정상';
    }
  };

  // 임계치 값 찾기
  const getThreshold = (name: string) => {
    const found = thresholds.find(t => t.name === name);
    return found ? found.threshold : undefined;
  };

  // 모션 감지 상태 한글 변환
  const getMotionDetectionText = (status?: string) => {
    switch (status) {
      case 'detection':
        return '감지';
      case 'normal':
      default:
        return '정상';
    }
  };

  const handleLightToggle = async () => {
    if (currentSensor && !isLoading && currentSensor.lightStatus === 'on') {
      setIsLoading(true);
      try {
        // Implement the logic to turn off the light
      } catch (error) {
        console.error('Error turning off the light:', error);
      } finally {
        setIsLoading(false);
      }
    } else if (currentSensor && !isLoading && currentSensor.lightStatus === 'off') {
      setIsLoading(true);
      try {
        // Implement the logic to turn on the light
      } catch (error) {
        console.error('Error turning on the light:', error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-black mb-4">센서 상세 정보</h2>
      {currentSensor ? (
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600">센서 ID</p>
            <p className="text-black font-medium">{currentSensor.sensor_id}</p>
          </div>

          {/* 조명 상태 */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">조명 상태</p>
              <div className="flex items-center gap-3">
                <button
                  onClick={handleLightToggle}
                  disabled={isLoading || currentSensor.lightStatus === 'error'}
                  className={`
                    px-4 py-1.5 rounded-md text-sm font-semibold transition-all duration-300
                    focus:outline-none focus:ring-2 focus:ring-offset-2
                    ${currentSensor.lightStatus === 'on'
                      ? 'bg-red-500 hover:bg-red-600 text-white focus:ring-red-500'
                      : currentSensor.lightStatus === 'error'
                      ? 'bg-gray-500 hover:bg-gray-600 text-white focus:ring-gray-500'
                      : 'bg-blue-500 hover:bg-blue-600 text-white focus:ring-blue-500'}
                    ${currentSensor.lightStatus === 'error' ? 'opacity-50 cursor-not-allowed' : ''}
                    ${isLoading ? 'opacity-70 cursor-wait' : ''}
                  `}
                  aria-label={`조명 ${currentSensor.lightStatus === 'on' ? '끄기' : '켜기'}`}
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    currentSensor.lightStatus === 'on' 
                      ? '조명 끄기' 
                      : currentSensor.lightStatus === 'error'
                      ? '조명 문제'
                      : '조명 켜기'
                  )}
                </button>
                <div className="flex items-center gap-2">
                  <Lightbulb 
                    size={20} 
                    className={
                      currentSensor.lightStatus === 'error' 
                        ? "text-red-500" 
                        : currentSensor.lightStatus === 'on'
                        ? "text-yellow-500"
                        : "text-gray-400"
                    } 
                  />
                  <span className={`font-bold ${
                    currentSensor.lightStatus === 'error' 
                      ? 'text-red-600' 
                      : currentSensor.lightStatus === 'on'
                      ? 'text-green-600'
                      : 'text-gray-600'
                  }`}>
                    {currentSensor.lightStatus === 'error' 
                      ? '비정상' 
                      : currentSensor.lightStatus === 'on'
                      ? '켜짐'
                      : '꺼짐'}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 화재감지 상태 */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">화재 감지 상태</p>
              <div className="flex items-center">
                <Flame 
                  size={20} 
                  className={currentSensor.fireDetector === 'detection' ? "text-red-500" : "text-gray-400"} 
                />
                <span className={`ml-2 font-bold ${currentSensor.fireDetector === 'detection' ? 'text-red-600' : 'text-green-600'}`}>
                  {currentSensor.fireDetector === 'detection' ? '화재 감지' : '정상'}
                </span>
              </div>
            </div>
          </div>

          {/* 모션 감지 상태 */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">모션 감지 상태</p>
              <div className="flex items-center">
                <User
                  size={20}
                  className={currentSensor.motionDetection === 'detection' ? "text-red-500" : "text-gray-400"}
                  aria-label="모션 감지"
                  tabIndex={0}
                />
                <span className={`ml-2 font-bold ${currentSensor.motionDetection === 'detection' ? 'text-red-600' : 'text-green-600'}`}>
                  {currentSensor.motionDetection === 'detection' ? '감지' : '정상'}
                </span>
              </div>
            </div>
          </div>

          {/* 센서 데이터 */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">센서 데이터</p>
              <div className="flex items-center">
                <Wind 
                  size={20} 
                  className={
                    currentSensor.sensors.some(sensor => {
                      const threshold = getThreshold(sensor.name);
                      return threshold !== undefined && sensor.value >= threshold;
                    }) ? "text-red-500" : "text-gray-400"
                  }
                />
                <span className={`ml-2 font-bold ${
                  currentSensor.sensors.some(sensor => {
                    const threshold = getThreshold(sensor.name);
                    return threshold !== undefined && sensor.value >= threshold;
                  }) ? "text-red-600" : "text-green-600"
                }`}>
                  {currentSensor.sensors.some(sensor => {
                    const threshold = getThreshold(sensor.name);
                    return threshold !== undefined && sensor.value >= threshold;
                  }) ? "위험" : "정상"}
                </span>
              </div>
            </div>
          </div>

          {/* 센서 수치 데이터 */}
          <div className="space-y-3">
            {currentSensor.sensors.map((sensor, index) => {
              const threshold = getThreshold(sensor.name);
              const valueStatus = getValueStatus(sensor.name, sensor.value, thresholds);
              return (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-medium">
                      {sensor.name === 'co2' ? '이산화탄소' : '일산화탄소'}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className={`text-lg font-bold ${threshold !== undefined && sensor.value >= threshold ? "text-red-600" : "text-green-600"}`}>
                        {sensor.value}
                      </span>
                      {threshold !== undefined && (
                        <span className="text-gray-500 text-sm">/ {threshold} (임계치)</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      ) : (
        <p className="text-gray-500 text-center py-4">
          센서를 선택하여 상세 정보를 확인하세요
        </p>
      )}
    </div>
  );
};

export default SensorDetails; 