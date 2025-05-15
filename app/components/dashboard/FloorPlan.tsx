import React, { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import { Sensor as SensorType } from '../../types';
import Sensor from './Sensor';
import LoadingSpinner from '../ui/LoadingSpinner';
import styles from '../../styles/components/dashboard.module.css';

interface FloorPlanProps {
  sensors: SensorType[];
  isLoading: boolean;
  onSensorClick: (sensor: SensorType) => void;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ sensors, isLoading, onSensorClick }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);

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
                  onClick={onSensorClick}
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
    </div>
  );
};

export default FloorPlan; 