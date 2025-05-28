import React, { useState, useRef } from 'react';
import { X, Flame, User, Lightbulb } from 'lucide-react';
import { Sensor as SensorType } from '../../api/sensors/types';
import { sensorService } from '../../services/sensorService';

interface SensorModalProps {
  sensor: SensorType;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
}

const MODAL_WIDTH = 400;
const MODAL_HEIGHT = 420;

const SensorModal: React.FC<SensorModalProps> = ({ 
  sensor, 
  isOpen, 
  onClose,
  onStatusChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
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

  // 조명 상태 표기
  const lightingStatusText = sensor.lightStatus === 'shutdown' ? '비정상' : '정상';
  const lightingStatusColor = sensor.lightStatus === 'shutdown' ? 'text-red-600' : 'text-green-600';

  // 화재 감지 상태 표기
  const fireStatusDetected = sensor.fireDetector === 'detection';
  const fireStatusText = fireStatusDetected ? '화재 감지 발생' : '이상없음';
  const fireStatusColor = fireStatusDetected ? 'text-red-600' : 'text-green-600';

  // 화재 감지 처리 버튼 클릭 핸들러
  const handleFireHandle = async () => {
    setIsLoading(true);
    try {
      await sensorService.putSensorEvent({
        sensor_id: sensor.id,
        status: 'detection',
        type: 'fire',
      });
      onStatusChange(sensor.id, 'normal');
      onClose();
    } catch (error) {
      console.error('Failed to put sensor event:', error);
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
        className="bg-white border-2 border-black rounded-lg shadow-xl p-6 max-w-md w-full text-black"
        style={{
          position: 'fixed',
          left: position.x,
          top: position.y,
          width: MODAL_WIDTH,
          minHeight: MODAL_HEIGHT,
          cursor: isDragging ? 'grabbing' : 'default',
          zIndex: 1000,
          userSelect: isDragging ? 'none' : 'auto',
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
            <span className="font-mono text-sm text-black">{sensor.sensor_id}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">타입</span>
            <span className="text-black font-semibold">{sensor.type}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">값</span>
            <span className="text-black font-semibold">
              {sensor.sensors.map((s, i) => (
                <span key={i} className="inline-block mr-2">
                  {s.name.toUpperCase()}: {s.value}
                </span>
              ))}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-gray-500 font-medium">위치</span>
            <span className="text-black font-semibold">
              X: {sensor.position.x}, Y: {sensor.position.y}
            </span>
          </div>
        </div>

        <div className="border-t pt-4 space-y-4">
          {/* 조명 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Lightbulb
                size={20}
                className={sensor.lightStatus === 'on' ? 'text-yellow-500' : 'text-gray-400'}
                aria-label="조명 상태"
                tabIndex={0}
              />
              <span className="ml-2 font-bold text-black">조명 상태</span>
            </div>
            <span className={`font-bold ${lightingStatusColor}`}>{lightingStatusText}</span>
          </div>
          {/* 화재 감지 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <Flame size={20} className={fireStatusDetected ? 'text-red-500' : 'text-gray-400'} />
              <span className="ml-2 font-bold text-black">화재 감지</span>
            </div>
            <span className={`font-bold ${fireStatusColor}`}>{fireStatusText}</span>
          </div>
          {/* 모션 감지 상태 */}
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <User
                size={20}
                className={sensor.motionDetection === 'detection' ? 'text-red-500' : 'text-gray-400'}
                aria-label="모션 감지"
                tabIndex={0}
              />
              <span className="ml-2 font-bold text-black">모션 감지</span>
            </div>
            <span className={`font-bold ${sensor.motionDetection === 'detection' ? 'text-red-600' : 'text-green-600'}`}>
              {sensor.motionDetection === 'detection' ? '감지' : '정상'}
            </span>
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