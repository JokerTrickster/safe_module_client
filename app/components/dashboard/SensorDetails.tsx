import React from 'react';
import { Sensor, SensorStatus } from '../../types';
import { Lightbulb, Flame } from 'lucide-react';
import styles from '../../styles/components/dashboard.module.css';

interface SensorDetailsProps {
  selectedSensor: (Sensor & { fireDetector?: string }) | null;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({ selectedSensor }) => {
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

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      <h2 className="text-xl font-bold text-black mb-4">센서 상세 정보</h2>
      {selectedSensor ? (
        <div className="space-y-4">
          <div className="border-b border-gray-200 pb-3">
            <p className="text-sm text-gray-600">센서 ID</p>
            <p className="text-black font-medium">{selectedSensor.sensor_id}</p>
          </div>

          {/* 조명 상태 */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">조명 상태</p>
              <div className="flex items-center">
                <Lightbulb 
                  size={20} 
                  className={selectedSensor.lightStatus === 'shutdown' ? "text-gray-400" : "text-yellow-500"} 
                />
                <span className="ml-2 text-black">
                  {getLightStatusText(selectedSensor.lightStatus)}
                </span>
              </div>
            </div>
          </div>

          {/* 화재감지 상태 */}
          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">화재감지 상태</p>
              <div className="flex items-center">
                <Flame 
                  size={20} 
                  className={selectedSensor.fireDetector === 'detection' ? "text-red-500" : "text-gray-400"} 
                />
                <span className="ml-2 text-black">
                  {getFireDetectorText(selectedSensor.fireDetector)}
                </span>
              </div>
            </div>
          </div>

          {/* 센서 데이터 */}
          <div>
            <p className="text-sm text-gray-600 mb-2">센서 데이터</p>
            <div className="space-y-3">
              {selectedSensor.sensors.map((sensor, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-md">
                  <div className="flex justify-between items-center">
                    <span className="text-black font-medium">
                      {sensor.name === 'co2' ? '이산화탄소' : '일산화탄소'}
                    </span>
                    <span className={`font-medium ${getStatusColor(sensor.status)}`}>
                      {getStatusText(sensor.status)}
                    </span>
                  </div>
                  <p className="text-2xl font-bold text-black mt-1">
                    {sensor.value}
                  </p>
                </div>
              ))}
            </div>
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