import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Sensor as SensorType } from '../../api/sensors/types';
import Sensor from './Sensor';
import SensorModal from './SensorModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from '../../styles/components/dashboard.module.css';
import { Flame, AlertTriangle } from 'lucide-react';
import { useSensors } from '../../hooks/useSensors';

interface FloorPlanProps {
  sensors: SensorType[];
  isLoading: boolean;
  onSensorClick: (sensor: SensorType) => void;
  onStatusChange?: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
  onSensorsUpdate?: (updatedSensors: SensorType[]) => void;
  selectedSensor: SensorType | null;
  setSelectedSensor: (sensor: SensorType | null) => void;
  isModalOpen: boolean;
  setIsModalOpen: (open: boolean) => void;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ 
  sensors, 
  isLoading, 
  onSensorClick,
  onStatusChange = () => {},
  onSensorsUpdate = () => {},
  selectedSensor,
  setSelectedSensor,
  isModalOpen,
  setIsModalOpen,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [isWebViewLoaded, setIsWebViewLoaded] = useState(false);

  const { thresholds} = useSensors();
  const co2Threshold = thresholds.find(t => t.name === 'co2')?.threshold ?? 3000;
  const coThreshold = thresholds.find(t => t.name === 'co')?.threshold ?? 500;

  // 기본 이미지 크기 상수 (iframe 기준)
  const BASE_IMAGE_WIDTH = 1300;
  const BASE_IMAGE_HEIGHT = 800;

  // 센서 위치 조정 함수
  const adjustedSensorPosition = (sensor: SensorType) => {
    const x = (sensor.position.x / BASE_IMAGE_WIDTH) * dimensions.width;
    const y = (sensor.position.y / BASE_IMAGE_HEIGHT) * dimensions.height;
    return { x, y };
  };

  // 센서 클릭 처리
  const handleSensorClick = (sensor: SensorType) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
    onSensorClick(sensor);
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  // 센서 상태 변경 처리
  const handleStatusChange = (sensorId: string, status: 'normal' | 'warning' | 'danger') => {
    onStatusChange(sensorId, status);
    if (selectedSensor && (selectedSensor.id === sensorId || selectedSensor.sensor_id === sensorId)) {
      setSelectedSensor({
        ...selectedSensor,
        status
      });
    }
   
  };

  // 웹뷰 메시지 리스너 등록
  useEffect(() => {
    if (!isWebViewLoaded) return;

    const sendSensorAlerts = () => {
      sensors.forEach(sensor => {
        const fireActive = sensor.fireDetector === 'detection';
        const co2 = sensor.sensors.find(s => s.name === 'co2');
        const co = sensor.sensors.find(s => s.name === 'co');
        const gasActive = (co2 && co2.value >= co2Threshold) || (co && co.value >= coThreshold);
        const lightActive = sensor.lightStatus === 'shutdown';
        const motionActive = sensor.motionDetection === 'detection';

        const message = {
          type: 'SENSOR_ALERTS',
          data: {
            sensorId: sensor.sensor_id || sensor.id,
            alerts: {
              fire: { isActive: fireActive },
              gas: { isActive: !!gasActive },
              light: { isActive: lightActive },
              motion: { isActive: motionActive }
            }
          }
        };

        const iframe = document.querySelector('iframe');
        if (iframe && iframe.contentWindow) {
          iframe.contentWindow.postMessage(
            message,
            'http://localhost:3000'
          );
        }
      });
    };
    
    // 5초마다 반복 실행
    const interval = setInterval(sendSensorAlerts, 1000);

    return () => clearInterval(interval);
  }, [sensors]);

  // 컨테이너 크기 업데이트
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerRef, isWebViewLoaded]);

  // 웹뷰 메시지 리스너 등록
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === 'http://localhost:3000') {
        let jsonData;
        try {
          jsonData = typeof event.data === 'string' ? JSON.parse(event.data) : event.data;
        } catch {
          return;
        }
        if (jsonData.type === 'SENSOR_ID') {
          const sensor = sensors.find(s => s.sensor_id === jsonData.data.sensorId);
          if (sensor) {
            setSelectedSensor(sensor);
            setIsModalOpen(true);
          }
        }
      }
    };
    window.addEventListener('message', handleMessage);
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [sensors, setSelectedSensor]);

  return (
    <div 
      className={styles.mapContainer} 
      ref={containerRef}
      style={{
        width: `${BASE_IMAGE_WIDTH}px`,
        height: `${BASE_IMAGE_HEIGHT}px`,
        background: '#f8fafc',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.floorPlanContainer}>
          <div className="relative w-full h-full">
            {/* 웹뷰로 대체 */}
            <iframe
              src="http://localhost:3000/?mode=safe&scale=0.12&pivot=0.13&env=desktop&parkingLotId=1&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwicm9sZSI6IkFETUlOIiwiaWF0IjoxNzQ3MTIwNDc3LCJleHAiOjE3NDk3NTAyMjF9.BPq02OnExiqyI6EoKL0pGupjiBRWtiZDIH_C8D02p9o&status=not_view"
              className={styles.floorPlanWebView}
              onLoad={() => setIsWebViewLoaded(true)}
              style={{
                width: '100%',
                height: '100%',
                border: 'none',
                position: 'absolute',
                top: 0,
                left: 0,
                zIndex: 1
              }}
              title="3D Floor WebView"
            />
            {/* 센서 오버레이 */}
            {isWebViewLoaded && dimensions.width > 0 && sensors.length > 0 ? (
              <div className="absolute inset-0 z-10 pointer-events-none">
                {sensors.map((sensor) => {
                  const co2 = sensor.sensors.find(s => s.name === 'co2');
                  const co = sensor.sensors.find(s => s.name === 'co');
                  const fireDetected = sensor.fireDetector === 'detection';
                  const co2Danger = co2 && co2.value >= co2Threshold;
                  const coDanger = co && co.value >= coThreshold;
                  const danger = fireDetected || co2Danger || coDanger;
                  return (
                    <div
                key={sensor.id}
                      className={`absolute cursor-pointer group ${danger ? 'animate-pulse' : ''}`}
                      style={{
                        left: `${adjustedSensorPosition(sensor).x}px`,
                        top: `${adjustedSensorPosition(sensor).y}px`,
                        transform: 'translate(-50%, -50%)',
                        pointerEvents: 'auto',
                        zIndex: 20
                      }}
                      onClick={() => handleSensorClick(sensor)}
                    >
                      <div
                        className={`flex items-center justify-center rounded-full border-2 ${fireDetected ? 'border-red-600 bg-red-100' : danger ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-white'} w-8 h-8 shadow-md relative`}
                      >
                        {fireDetected && (
                          <Flame size={20} className="text-red-600 absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow" />
                        )}
                        {(co2Danger || coDanger) && !fireDetected && (
                          <AlertTriangle size={18} className="text-yellow-500 absolute -top-3 left-1/2 -translate-x-1/2 drop-shadow" />
                        )}
                        <span className="text-xs font-bold text-black">{sensor.sensor_id.slice(-2)}</span>
                      </div>
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
                })}
              </div>
            ) : sensors.length === 0 ? (
            <div className={styles.noSensorsMessage}>
              No sensors found. Check data.json file.
            </div>
            ) : null}
          </div>
        </div>
      )}
      {selectedSensor && (
        <SensorModal 
          sensor={selectedSensor} 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
          thresholds={thresholds}
        />
      )}
    </div>
  );
};

export default FloorPlan; 