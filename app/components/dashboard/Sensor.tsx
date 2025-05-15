import React from 'react';
import { Sensor as SensorType } from '../../types';
import { AlertTriangle } from 'lucide-react';
import styles from '../../styles/components/dashboard.module.css';

interface SensorProps {
  sensor: SensorType;
  onClick: (sensor: SensorType) => void;
}

const Sensor: React.FC<SensorProps> = ({ sensor, onClick }) => {
  const { id, name, status, position } = sensor;
  
  // 센서 상태에 따른 색상 지정
  const statusColorMap = {
    normal: 'bg-green-500',
    warning: 'bg-yellow-500',
    danger: 'bg-red-500',
  };
  
  const statusColor = statusColorMap[status] || 'bg-gray-500';

  return (
    <div 
      className={styles.sensorContainer}
      style={{ 
        left: `${position.x}px`, 
        top: `${position.y}px` 
      }}
      onClick={() => onClick(sensor)}
      role="button"
      tabIndex={0}
      aria-label={`${name} 센서 (${id}): ${status === 'danger' ? '위험' : status === 'warning' ? '경고' : '정상'}`}
      onKeyDown={(e) => e.key === 'Enter' && onClick(sensor)}
    >
      {/* 센서 아이콘 */}
      <div className={`${styles.sensorIcon} ${statusColor}`}>
        {/* 위험 감지 시 느낌표 아이콘 표시 */}
        {status === 'danger' && (
          <div className="absolute -top-3 -right-1 bg-red-600 rounded-full p-1 animate-pulse">
            <AlertTriangle className="h-3 w-3 text-white" />
          </div>
        )}
      </div>
      
      {/* 센서 ID 라벨 - 아이콘 아래에 표시 */}
      <div className="absolute -bottom-6 left-1/2 transform -translate-x-1/2 bg-gray-800 bg-opacity-75 text-white text-xs px-2 py-0.5 rounded-md shadow-md whitespace-nowrap">
        {id}
      </div>
      
      {/* 호버 시 센서 정보 툴팁 */}
      <div className={styles.sensorTooltip}>
        <div className="font-bold mb-1">{name}</div>
        <div>ID: {id}</div>
        <div className="flex items-center mt-1">
          <span>상태: </span>
          <span className={`ml-1 px-1.5 py-0.5 rounded-full text-xs ${
            status === 'danger' ? 'bg-red-200 text-red-800' : 
            status === 'warning' ? 'bg-yellow-200 text-yellow-800' : 
            'bg-green-200 text-green-800'
          }`}>
            {status === 'danger' ? '위험' : status === 'warning' ? '경고' : '정상'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Sensor; 