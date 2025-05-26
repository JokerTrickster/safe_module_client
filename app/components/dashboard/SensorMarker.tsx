import React from 'react';
import { Sensor } from '../../api/sensors/types';
import { Flame, AlertTriangle } from 'lucide-react';

interface SensorMarkerProps {
  sensor: Sensor;
  onClick?: () => void;
}

const SensorMarker: React.FC<SensorMarkerProps> = ({ sensor, onClick }) => {
  // 센서 데이터 추출
  const co2 = sensor.sensors.find(s => s.name === 'co2');
  const co = sensor.sensors.find(s => s.name === 'co');

  // 임계치
  const co2Danger = co2 && co2.value >= 3000;
  const coDanger = co && co.value >= 500;
  const fireDetected = sensor.fireDetector === 'detection';

  // 강조 스타일
  const danger = fireDetected || co2Danger || coDanger;

  return (
    <div
      className={`
        absolute z-10 cursor-pointer group
        ${danger ? 'animate-pulse' : ''}
      `}
      style={{
        left: `${sensor.position.x}%`,
        top: `${sensor.position.y}%`,
        transform: 'translate(-50%, -50%)',
      }}
      onClick={onClick}
      tabIndex={0}
      aria-label={`센서 ${sensor.sensor_id}`}
      onKeyDown={e => e.key === 'Enter' && onClick && onClick()}
    >
      <div
        className={`
          flex items-center justify-center rounded-full border-2
          ${fireDetected ? 'border-red-600 bg-red-100' : danger ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'}
          w-8 h-8 shadow-md relative
        `}
      >
        {/* 화재 감지 시 불꽃 아이콘 */}
        {fireDetected && (
          <Flame size={20} className="text-red-600 absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow" />
        )}
        {/* CO/CO2 위험 시 경고 아이콘 */}
        {(co2Danger || coDanger) && !fireDetected && (
          <AlertTriangle size={18} className="text-yellow-500 absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow" />
        )}
        {/* 센서 라벨 */}
        <span className="text-xs font-bold text-black">{sensor.sensor_id.slice(-2)}</span>
      </div>
      {/* 툴팁 */}
      <div className="absolute left-1/2 top-10 -translate-x-1/2 bg-white border border-gray-300 rounded px-2 py-1 text-xs text-black shadow opacity-0 group-hover:opacity-100 pointer-events-none z-20">
        <div>센서ID: {sensor.sensor_id}</div>
        <div>CO₂: {co2 ? co2.value : '-'} ppm</div>
        <div>CO: {co ? co.value : '-'} ppm</div>
        <div>
          {fireDetected
            ? <span className="text-red-600 font-bold">화재 감지!</span>
            : co2Danger || coDanger
            ? <span className="text-yellow-600 font-bold">경고</span>
            : <span className="text-green-600">정상</span>
          }
        </div>
      </div>
    </div>
  );
};

export default SensorMarker; 