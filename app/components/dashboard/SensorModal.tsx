import React, { useState, useRef } from 'react';
import { X, Flame, User, Lightbulb } from 'lucide-react';
import { Sensor, Sensor as SensorType } from '../../api/sensors/types';
import { sensorService } from '../../services/sensorService';

interface SensorModalProps {
  sensors: Sensor[];
  sensor: SensorType;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
  thresholds: { name: string; threshold: number }[];

}

const MODAL_WIDTH = 400;
const MODAL_HEIGHT = 420;


const getValueStatus = (name: string, value: number, thresholds: { name: string; threshold: number }[]) => {
  const threshold = thresholds.find(t => t.name === name);
  if (!threshold) return { label: '정상', color: 'text-green-600' };
  if (value >= threshold.threshold) return { label: '위험', color: 'text-red-600' };
  if (value >= threshold.threshold * 0.8) return { label: '경고', color: 'text-yellow-600' };
  return { label: '정상', color: 'text-green-600' };
};

const SensorModal: React.FC<SensorModalProps> = ({ 
  sensors,
  sensor, 
  isOpen, 
  onClose,
  onStatusChange,
  thresholds 
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentSensor, setCurrentSensor] = useState(sensor);
  // 드래그 상태 및 위치
  const [isDragging, setIsDragging] = useState(false);
  const [position, setPosition] = useState<{ x: number; y: number }>(() => {
    if (typeof window !== 'undefined') {
      const x = window.innerWidth / 2 - MODAL_WIDTH / 2;
      const y = window.innerHeight / 2 - MODAL_HEIGHT / 2;
      return { x, y };
    }
    return { x: 0, y: 0 };
  });
  const dragOffset = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // sensors가 변경될 때마다 현재 센서 정보 업데이트
  React.useEffect(() => {
    const updatedSensor = sensors.find(s => s.id === sensor.id);
    if (updatedSensor) {
      setCurrentSensor(updatedSensor);
    }
  }, [sensors, sensor.id]);

  React.useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging]);

  if (!isOpen) return null;
  // 임계치 값 찾기
  const getThreshold = (name: string) => {
    const found = thresholds.find(t => t.name === name);
    return found ? found.threshold : undefined;
  };

  // 조명 상태 표기
  const lightingStatusText = currentSensor.lightStatus === 'error' ? '비정상' : '정상';
  const lightingStatusColor = currentSensor.lightStatus === 'error' ? 'text-red-600' : 'text-green-600';

  // 화재 감지 상태 표기
  const fireStatusDetected = currentSensor.fireDetector === 'detection';
  const fireStatusText = fireStatusDetected ? '화재 감지 발생' : '이상없음';
  const fireStatusColor = fireStatusDetected ? 'text-red-600' : 'text-green-600';

  // 화재 감지 처리 버튼 클릭 핸들러
  const handleFireHandle = async () => {
    setIsLoading(true);
    try {
      await sensorService.putSensorEvent({
        sensor_id: currentSensor.id,
        status: 'detection',
        type: 'fire',
      });
      onStatusChange(currentSensor.id, 'normal');
      onClose();
    } catch (error) {
      console.error('Failed to put sensor event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 조명 상태 토글 핸들러
  const handleLightToggle = async () => {
    if (currentSensor.lightStatus === 'error') return;
    
    setIsLoading(true);
    try {
      const newStatus = currentSensor.lightStatus === 'on' ? 'off' : 'on';
      

      await sensorService.toggleLight({
        sensorID: currentSensor.sensor_id,
        status: newStatus
      });
      
      // 1.5초 딜레이 추가
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // 현재 센서 상태 업데이트
      setCurrentSensor(prev => ({
        ...prev,
        lightStatus: newStatus
      }));
    } catch (error) {
      console.error('Failed to toggle light:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // 드래그 핸들러
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    dragOffset.current = {
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    };
    document.body.style.userSelect = 'none';
  };
  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragOffset.current.x,
      y: e.clientY - dragOffset.current.y,
    });
  };
  const handleMouseUp = () => {
    setIsDragging(false);
    document.body.style.userSelect = '';
  };

  return (
    <div 
      className="fixed inset-0 z-50 pointer-events-none"
      style={{ pointerEvents: 'auto' }}
    >
      <div 
        className={`bg-white border-2 border-black rounded-lg shadow-xl p-6 max-w-md w-full text-black transition-opacity duration-150`}
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: MODAL_WIDTH,
          minHeight: MODAL_HEIGHT,
          cursor: isDragging ? 'grabbing' : 'default',
          zIndex: 1000,
          userSelect: isDragging ? 'none' : 'auto',
          opacity: isDragging ? 0.4 : 1,
        }}
        onClick={e => e.stopPropagation()}
        onMouseDown={handleMouseDown}
      >
        {/* 닫기 버튼 */}
        <button 
          onClick={onClose}
          onMouseDown={e => e.stopPropagation()}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 transition-colors rounded-full p-1 focus:outline-none"
          aria-label="닫기"
          tabIndex={0}
        >
          <X size={22} />
        </button>

        {/* 드래그 핸들러 (헤더) */}
        <div
          className="flex justify-between items-center border-b pb-3 mb-4 cursor-move select-none"
        >
          <h2 className="text-lg font-bold flex items-center">센서 정보</h2>
        </div>

        {/* 센서 정보 상세 */}
        <div className="space-y-3 mb-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">ID</span>
            <span className="font-mono text-sm text-black">{currentSensor.sensor_id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">타입</span>
            <span className="text-black font-semibold">
              {currentSensor.type === 'co2'
                ? '이산화탄소 (CO2)'
                : currentSensor.type === 'co'
                ? '일산화탄소 (CO)'
                : currentSensor.type}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">값</span>
            <span className="text-black font-semibold">
              {currentSensor.sensors.map((s, i) => {
                let threshold;
                if (s.name === 'co2') {
                  threshold = getThreshold('co2');
                } else if (s.name === 'co') {
                  threshold = getThreshold('co');
                }
                // 센서명 한글 변환
                const label =
                  s.name === 'co2'
                    ? '이산화탄소'
                    : s.name === 'co'
                    ? '일산화탄소'
                    : s.name;
                return (
                  <span key={i} className="inline-block mr-2">
                    <span className={threshold !== undefined && s.value >= threshold ? "text-red-600 font-bold" : "text-green-600 font-bold"}>
                      {s.value}
                    </span>
                    {threshold !== undefined && (
                      <span className="text-gray-500 text-xs ml-1">/ {threshold}</span>
                    )}
                  </span>
                );
              })}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">위치</span>
            <span className="text-black font-semibold">
              X: {currentSensor.position.x}, Y: {currentSensor.position.y}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          {/* 조명 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center w-32">
              <Lightbulb
                size={20}
                className={
                  currentSensor.lightStatus === 'error' 
                    ? 'text-red-500' 
                    : currentSensor.lightStatus === 'on'
                    ? 'text-yellow-500'
                    : 'text-gray-400'
                }
                aria-label="조명 상태"
                tabIndex={0}
              />
              <span className="ml-2 font-bold text-black">조명 상태</span>
            </div>
            <div className="flex items-center gap-4">
              <button
                onClick={handleLightToggle}
                disabled={isLoading || currentSensor.lightStatus === 'error'}
                className={`
                  relative inline-flex h-8 w-16 items-center rounded-md transition-all duration-300
                  focus:outline-none focus:ring-2 focus:ring-offset-2
                  ${currentSensor.lightStatus === 'on' 
                    ? 'bg-blue-500 hover:bg-blue-600 focus:ring-blue-500' 
                    : 'bg-gray-200 hover:bg-gray-300 focus:ring-gray-400'}
                  ${currentSensor.lightStatus === 'error' ? 'opacity-50 cursor-not-allowed' : ''}
                  ${isLoading ? 'opacity-70 cursor-wait' : ''}
                `}
                aria-label={`조명 ${currentSensor.lightStatus === 'on' ? '끄기' : '켜기'}`}
              >
                <span
                  className={`
                    absolute flex items-center justify-center h-6 w-6 transform rounded-md bg-white transition-all duration-300
                    ${currentSensor.lightStatus === 'on' ? 'translate-x-10' : 'translate-x-1'}
                    shadow-sm
                    ${currentSensor.lightStatus === 'on' ? 'scale-105' : 'scale-100'}
                    ${isLoading ? 'animate-pulse' : ''}
                  `}
                >
                  {isLoading ? (
                    <div className="w-3 h-3 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <span className={`
                      text-xs font-semibold
                      ${currentSensor.lightStatus === 'on' ? 'text-blue-500' : 'text-gray-400'}
                    `}>
                      {currentSensor.lightStatus === 'on' ? 'ON' : 'OFF'}
                    </span>
                  )}
                </span>
              </button>
              <span className={`font-bold ${lightingStatusColor}`}>{lightingStatusText}</span>
            </div>
          </div>

          {/* 화재 감지 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center w-32">
              <Flame 
                size={20} 
                className={fireStatusDetected ? 'text-red-500' : 'text-gray-400'} 
              />
              <span className="ml-2 font-bold text-black">화재 감지</span>
            </div>
            <div className="flex items-center gap-6">
              <span className={`font-bold ${fireStatusColor}`}>{fireStatusText}</span>
            </div>
          </div>

          {/* 모션 감지 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center w-32">
              <User
                size={20}
                className={currentSensor.motionDetection === 'detection' ? 'text-red-500' : 'text-gray-400'}
                aria-label="모션 감지"
                tabIndex={0}
              />
              <span className="ml-2 font-bold text-black">모션 감지</span>
            </div>
            <div className="flex items-center gap-6">
              <span className={`font-bold ${currentSensor.motionDetection === 'detection' ? 'text-red-600' : 'text-green-600'}`}>
                {currentSensor.motionDetection === 'detection' ? '감지' : '정상'}
              </span>
            </div>
          </div>

          {/* 화재 감지 처리 버튼 */}
          {fireStatusDetected && (
            <button
              className="w-full mt-2 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors font-bold flex items-center justify-center disabled:opacity-60"
              onClick={handleFireHandle}
              disabled={isLoading}
            >
              <Flame size={18} className="mr-2" />
              {isLoading ? '처리 중...' : '화재 감지 처리'}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SensorModal; 