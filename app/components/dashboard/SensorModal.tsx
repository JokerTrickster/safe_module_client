import React, { useState, useEffect } from 'react';
import { X, AlertCircle, Lightbulb, Bell, AlertTriangle } from 'lucide-react';
import { Sensor as SensorType } from '../../types';

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
  const [lightOn, setLightOn] = useState(sensor.lightStatus === 'on');
  const [alarmOn, setAlarmOn] = useState(false);

  useEffect(() => {
    if (sensor.status === 'danger') {
      setAlarmOn(true);
    }
  }, [sensor.status]);

  if (!isOpen) return null;

  const handleStatusChange = (status: 'normal' | 'warning' | 'danger') => {
    onStatusChange(sensor.id, status);
    if (status === 'normal') {
      setAlarmOn(false);
    }
    if (status === 'danger') {
      setAlarmOn(true);
    }
  };

  const getStatusStyles = () => {
    switch (sensor.status) {
      case 'normal':
        return { 
          text: '정상', 
          bgColor: 'bg-green-100', 
          textColor: 'text-green-800',
          borderColor: 'border-green-500'
        };
      case 'warning':
        return { 
          text: '경고', 
          bgColor: 'bg-yellow-100', 
          textColor: 'text-yellow-800',
          borderColor: 'border-yellow-500'
        };
      case 'danger':
        return { 
          text: '위험', 
          bgColor: 'bg-red-100', 
          textColor: 'text-red-800',
          borderColor: 'border-red-500'
        };
      default:
        return { 
          text: '알 수 없음', 
          bgColor: 'bg-gray-100', 
          textColor: 'text-gray-800',
          borderColor: 'border-gray-500'
        };
    }
  };

  const statusStyle = getStatusStyles();

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* 헤더 - 센서 정보 (상태) */}
        <div className="flex justify-between items-center border-b border-gray-200 pb-4 mb-4">
          <h2 className="text-xl font-bold text-black flex items-center">
            <span>센서 정보</span>
            <span className={`ml-2 text-sm px-2 py-1 rounded-full ${statusStyle.bgColor} ${statusStyle.textColor}`}>
              {statusStyle.text}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-600 hover:text-black transition-colors"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        {/* 센서 ID */}
        <div className="mb-4">
          <p className="text-sm text-gray-600">센서 ID</p>
          <p className="text-lg font-semibold text-black">{sensor.sensor_id}</p>
        </div>

        {/* 센서 데이터 */}
        <div className="mb-6">
          <h3 className="text-sm font-medium text-gray-600 mb-3">센서 데이터</h3>
          <div className="space-y-3">
            {sensor.sensors.map((sensorData, index) => (
              <div key={index} className="bg-gray-50 p-3 rounded-md">
                <div className="flex justify-between items-center">
                  <span className="text-black font-medium">
                    {sensorData.name === 'co2' ? '이산화탄소' : '일산화탄소'}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    sensorData.status === 'danger' ? 'bg-red-100 text-red-800' : 
                    sensorData.status === 'warning' ? 'bg-yellow-100 text-yellow-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    {sensorData.status === 'danger' ? '위험' : 
                     sensorData.status === 'warning' ? '경고' : '정상'}
                  </span>
                </div>
                <p className="text-2xl font-bold text-black mt-1">
                  {sensorData.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 제어 섹션 */}
        <div className="border-t border-gray-200 pt-4">
          <h3 className="font-bold text-black mb-4">센서 제어</h3>
          
          {/* 조명 상태 */}
          <div className="flex justify-between items-center mb-4">
            <div className="flex items-center">
              <Lightbulb size={20} className={lightOn ? "text-yellow-600" : "text-gray-600"} />
              <span className="ml-2 text-black">조명</span>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={lightOn}
                onChange={() => setLightOn(!lightOn)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
            </label>
          </div>

          {/* 비상벨 */}
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center">
              <Bell size={20} className={alarmOn ? "text-red-600" : "text-gray-600"} />
              <span className="ml-2 text-black">비상벨</span>
              {sensor.status === 'danger' && alarmOn && (
                <span className="ml-2 text-xs text-red-600 animate-pulse">
                  (활성화됨)
                </span>
              )}
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                className="sr-only peer"
                checked={alarmOn}
                onChange={() => setAlarmOn(!alarmOn)}
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-red-600"></div>
            </label>
          </div>

          {/* 센서 상태 변경 버튼 */}
          <div>
            <h4 className="mb-2 text-sm font-medium text-black">센서 상태 변경</h4>
            <div className="flex space-x-2">
              <button 
                className={`flex-1 py-2 ${sensor.status === 'normal' ? 'bg-green-600' : 'bg-green-500 hover:bg-green-600'} text-white rounded-md transition-colors flex items-center justify-center`}
                onClick={() => handleStatusChange('normal')}
              >
                <span>정상</span>
              </button>
              <button 
                className={`flex-1 py-2 ${sensor.status === 'warning' ? 'bg-yellow-600' : 'bg-yellow-500 hover:bg-yellow-600'} text-white rounded-md transition-colors flex items-center justify-center`}
                onClick={() => handleStatusChange('warning')}
              >
                <AlertCircle size={16} className="mr-1" />
                <span>경고</span>
              </button>
              <button 
                className={`flex-1 py-2 ${sensor.status === 'danger' ? 'bg-red-600' : 'bg-red-500 hover:bg-red-600'} text-white rounded-md transition-colors flex items-center justify-center`}
                onClick={() => handleStatusChange('danger')}
              >
                <AlertTriangle size={16} className="mr-1" />
                <span>위험</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorModal; 