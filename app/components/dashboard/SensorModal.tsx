import React, { useState } from 'react';
import { X, Flame } from 'lucide-react';
import { Sensor as SensorType } from '../../types';
import { sensorService } from '../../services/sensorService';

interface SensorModalProps {
  sensor: SensorType;
  isOpen: boolean;
  onClose: () => void;
  onStatusChange: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
}

const SensorModal: React.FC<SensorModalProps> = ({ 
  sensor, 
  isOpen, 
  onClose,
  onStatusChange 
}) => {
  const [isLoading, setIsLoading] = useState(false);
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
    } catch (error) {
      console.error('Failed to put sensor event:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl pointer-events-auto text-black"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <span className="ml-2">센서 정보</span>
          </h2>
          <button 
            onClick={onClose}
            className="text-black hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-4 rounded-md mb-4 border-l-4 border-gray-300 bg-gray-50">
          <p className="text-lg font-semibold text-black">{sensor.name}</p>
          <p className="text-black">ID: {sensor.id}</p>
          <p className="text-black">
            타입: {sensor.type}
          </p>
          <p className="text-black">
            위치: X: {sensor.position.x.toFixed(0)}, Y: {sensor.position.y.toFixed(0)}
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold mb-3 text-black">센서 제어</h3>
          <div className="space-y-4">
            {/* 조명 상태 */}
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <span className="font-bold text-black">조명 상태</span>
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
    </div>
  );
};

export default SensorModal; 