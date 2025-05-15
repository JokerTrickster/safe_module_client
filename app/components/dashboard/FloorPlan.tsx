import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Sensor as SensorType } from '../../types';
import Sensor from './Sensor';
import SensorModal from './SensorModal';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from '../../styles/components/dashboard.module.css';

interface FloorPlanProps {
  sensors: SensorType[];
  isLoading: boolean;
  onSensorClick: (sensor: SensorType) => void;
  onStatusChange?: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ 
  sensors, 
  isLoading, 
  onSensorClick,
  onStatusChange = () => {} // 기본 빈 함수 제공
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 센서 클릭 처리
  const handleSensorClick = (sensor: SensorType) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
    onSensorClick(sensor); // 상위 컴포넌트에 알림
  };

  // 모달 닫기
  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedSensor(null);
  };

  // 센서 상태 변경 처리
  const handleStatusChange = (sensorId: string, status: 'normal' | 'warning' | 'danger') => {
    onStatusChange(sensorId, status);
    // 모달 내 선택된 센서의 상태도 업데이트
    if (selectedSensor && selectedSensor.id === sensorId) {
      setSelectedSensor({
        ...selectedSensor,
        status
      });
    }
  };

  // 이미지가 로드되고 컨테이너 크기가 변경될 때 크기를 업데이트
  useEffect(() => {
    const updateDimensions = () => {
      if (containerRef.current) {
        setDimensions({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight
        });
      }
    };

    // 초기 로드 및 리사이즈 시 크기 업데이트
    updateDimensions();
    window.addEventListener('resize', updateDimensions);

    return () => {
      window.removeEventListener('resize', updateDimensions);
    };
  }, [containerRef, imageLoaded]);

  // 센서 위치를 이미지 크기에 맞게 조정하는 함수
  const adjustedSensorPosition = (sensor: SensorType) => {
    // 기본 이미지 크기 (디자인 시 기준점)
    const baseImageWidth = 1200;
    const baseImageHeight = 800;

    // 현재 컨테이너 크기에 맞게 센서 위치 조정
    const adjustedX = (sensor.position.x / baseImageWidth) * dimensions.width;
    const adjustedY = (sensor.position.y / baseImageHeight) * dimensions.height;

    return {
      x: adjustedX,
      y: adjustedY
    };
  };

  return (
    <div className={styles.mapContainer} ref={containerRef}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.floorPlanContainer}>
          <div className="relative w-full h-full">
            <Image 
              src="/3d.png" 
              alt="3D Floor Plan"
              width={1200}
              height={800}
              layout="responsive"
              className={styles.floorPlanImage}
              onLoad={() => setImageLoaded(true)}
              priority
            />
            
            {imageLoaded && dimensions.width > 0 && sensors.length > 0 ? (
              sensors.map((sensor) => (
                <Sensor 
                  key={sensor.id}
                  sensor={{
                    ...sensor,
                    position: adjustedSensorPosition(sensor)
                  }}
                  onClick={handleSensorClick}
                />
              ))
            ) : sensors.length === 0 ? (
              <div className={styles.noSensorsMessage}>
                No sensors found. Check data.json file.
              </div>
            ) : null}
          </div>
        </div>
      )}

      {/* 센서 모달 */}
      {selectedSensor && (
        <SensorModal 
          sensor={selectedSensor} 
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onStatusChange={handleStatusChange}
        />
      )}
    </div>
  );
};

export default FloorPlan; 