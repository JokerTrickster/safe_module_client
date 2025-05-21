import React from 'react';
import { Sensor, SensorStatus } from '../../types';
import { Lightbulb } from 'lucide-react';
import styles from '../../styles/components/dashboard.module.css';

interface SensorDetailsProps {
  selectedSensor: Sensor | null;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({ selectedSensor }) => {
  const getStatusColor = (status: SensorStatus) => {
    switch (status) {
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

  const getStatusText = (status: SensorStatus) => {
    switch (status) {
      case 'danger':
        return '위험';
      case 'warning':
        return '경고';
      case 'warmup':
        return '준비중';
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

          <div className="border-b border-gray-200 pb-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-600">조명 상태</p>
              <div className="flex items-center">
                <Lightbulb 
                  size={20} 
                  className={selectedSensor.lightStatus === 'on' ? "text-yellow-500" : "text-gray-400"} 
                />
                <span className="ml-2 text-black">
                  {selectedSensor.lightStatus === 'on' ? '켜짐' : '꺼짐'}
                </span>
              </div>
            </div>
          </div>

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