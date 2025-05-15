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
  const [lightOn, setLightOn] = useState(false);
  const [alarmOn, setAlarmOn] = useState(false);

  // 센서 상태가 변경될 때 자동으로 알람 상태 업데이트
  useEffect(() => {
    // 센서가 '위험' 상태일 때 자동으로 알람 켜기
    if (sensor.status === 'danger') {
      setAlarmOn(true);
    }
  }, [sensor.status]);

  if (!isOpen) return null;

  const handleStatusChange = (status: 'normal' | 'warning' | 'danger') => {
    onStatusChange(sensor.id, status);
    
    // '정상' 상태로 변경되면 알람을 자동으로 끄기
    if (status === 'normal') {
      setAlarmOn(false);
    }
    
    // '위험' 상태로 변경되면 알람을 자동으로 켜기
    if (status === 'danger') {
      setAlarmOn(true);
    }
  };

  // 센서 타입에 따른 아이콘 및 색상
  const getSensorTypeIcon = () => {
    switch (sensor.type) {
      case 'temperature':
        return <div className="text-red-500">🌡️</div>;
      case 'humidity':
        return <div className="text-blue-500">💧</div>;
      case 'pressure':
        return <div className="text-green-500">🔄</div>;
      default:
        return <div className="text-gray-500">📊</div>;
    }
  };

  // 센서 상태에 따른 스타일 및 텍스트
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
    <div 
      className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none"
    >
      <div 
        className="bg-white rounded-lg max-w-md w-full p-6 shadow-xl pointer-events-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center border-b pb-4 mb-4">
          <h2 className="text-xl font-bold flex items-center">
            {getSensorTypeIcon()}
            <span className="ml-2">센서 정보</span>
            <span className={`ml-2 text-sm px-2 py-1 rounded-full ${statusStyle.bgColor} ${statusStyle.textColor}`}>
              {statusStyle.text}
            </span>
          </h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
            aria-label="닫기"
          >
            <X size={24} />
          </button>
        </div>

        <div className={`p-4 rounded-md mb-4 border-l-4 ${statusStyle.borderColor} bg-gray-50`}>
          <p className="text-lg font-semibold">{sensor.name}</p>
          <p className="text-gray-600">ID: {sensor.id}</p>
          <p className="text-gray-600">
            타입: {
              sensor.type === 'temperature' ? '온도' : 
              sensor.type === 'humidity' ? '습도' : 
              sensor.type === 'pressure' ? '압력' : 
              sensor.type
            }
          </p>
          <p className="text-gray-600">
            위치: X: {sensor.position.x.toFixed(0)}, Y: {sensor.position.y.toFixed(0)}
          </p>
        </div>

        <div className="border-t pt-4">
          <h3 className="font-bold mb-3">센서 제어</h3>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Lightbulb size={20} className={lightOn ? "text-yellow-500" : "text-gray-400"} />
                <span className="ml-2">조명</span>
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

            <div className="flex justify-between items-center">
              <div className="flex items-center">
                <Bell size={20} className={alarmOn ? "text-red-500" : "text-gray-400"} />
                <span className="ml-2">비상벨</span>
                {sensor.status === 'danger' && alarmOn && (
                  <span className="ml-2 text-xs text-red-500 animate-pulse">
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
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="mt-6">
            <h4 className="mb-2 text-sm font-medium text-gray-700">센서 상태 변경</h4>
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