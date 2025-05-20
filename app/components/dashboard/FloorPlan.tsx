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
  onSensorsUpdate?: (updatedSensors: SensorType[]) => void;
}

const FloorPlan: React.FC<FloorPlanProps> = ({ 
  sensors, 
  isLoading, 
  onSensorClick,
  onStatusChange = () => {},
  onSensorsUpdate = () => {}
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 0, height: 0 });
  const [imageLoaded, setImageLoaded] = useState(false);
  const [selectedSensor, setSelectedSensor] = useState<SensorType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scale, setScale] = useState(1); // 확대/축소 비율 상태 추가
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // 기본 이미지 크기 상수 수정
  const BASE_IMAGE_WIDTH = 1500;
  const BASE_IMAGE_HEIGHT = 900;

  // 초기 중앙 위치 계산
  useEffect(() => {
    if (containerRef.current && dimensions.width > 0) {
      const centerX = (dimensions.width - BASE_IMAGE_WIDTH) / 2;
      const centerY = (dimensions.height - BASE_IMAGE_HEIGHT) / 2;
      setPosition({ x: centerX, y: centerY });
    }
  }, [dimensions.width, dimensions.height]);

  // 마우스 휠 이벤트 핸들러 수정
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    const newScale = Math.min(Math.max(scale + delta, 1), 1.5);
    
    // 마우스 포인터 위치를 기준으로 확대/축소
    const rect = containerRef.current?.getBoundingClientRect();
    if (rect) {
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;
      
      // 중앙 기준 확대/축소
      const centerX = dimensions.width / 2;
      const centerY = dimensions.height / 2;
      
      const scaleChange = newScale - scale;
      setPosition({
        x: position.x - ((mouseX - centerX) * scaleChange),
        y: position.y - ((mouseY - centerY) * scaleChange)
      });
    }
    
    setScale(newScale);
  };

  // 마우스 이벤트 핸들러 수정
  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.button === 0) { // 왼쪽 클릭만 처리
      setIsDragging(true);
      setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
    }
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (isDragging) {
      const newX = e.clientX - dragStart.x;
      const newY = e.clientY - dragStart.y;
      
      // 드래그 범위 제한 (선택사항)
      const maxX = dimensions.width * (scale - 1);
      const maxY = dimensions.height * (scale - 1);
      
      setPosition({
        x: Math.min(Math.max(newX, -maxX), maxX),
        y: Math.min(Math.max(newY, -maxY), maxY)
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // 센서 위치 조정 함수 수정
  const adjustedSensorPosition = (sensor: SensorType) => {
    const x = (sensor.position.x / BASE_IMAGE_WIDTH) * dimensions.width;
    const y = (sensor.position.y / BASE_IMAGE_HEIGHT) * dimensions.height;
    
    return {
      x,
      y
    };
  };

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
    // 부모 컴포넌트에 상태 변경 알림
    onStatusChange(sensorId, status);
    
    // 모달 내 선택된 센서의 상태도 업데이트
    if (selectedSensor && selectedSensor.id === sensorId) {
      setSelectedSensor({
        ...selectedSensor,
        status
      });
    }
    
    // 정상 상태로 변경되고 모달을 자동으로 닫으려면 아래 코드 추가 (선택 사항)
    if (status === 'normal') {
      // 약간의 지연 후에 모달 닫기 (상태 변경 확인 가능하도록)
      setTimeout(() => {
        setIsModalOpen(false);
        setSelectedSensor(null);
      }, 1000);
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

  return (
    <div 
      className={styles.mapContainer} 
      ref={containerRef}
      onWheel={handleWheel}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
      style={{ 
        cursor: isDragging ? 'grabbing' : 'grab',
        overflow: 'hidden',
        width: '1400px',
        height: '900px',
        background: '#f8fafc',
        borderRadius: '0.5rem',
        boxShadow: '0 2px 8px rgba(0,0,0,0.07)'
      }}
    >
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.floorPlanContainer}>
          <div 
            className="relative w-full h-full"
            style={{
              transform: `scale(${scale}) translate(${position.x}px, ${position.y}px)`,
              transformOrigin: 'center center',
              transition: isDragging ? 'none' : 'transform 0.1s ease-out'
            }}
          >
            <div className="relative w-full h-full">
              <Image 
                src="/3d.png" 
                alt="3D Floor Plan"
                width={BASE_IMAGE_WIDTH}
                height={BASE_IMAGE_HEIGHT}
                layout="responsive"
                className={styles.floorPlanImage}
                onLoad={() => setImageLoaded(true)}
                priority
              />
              
              {imageLoaded && dimensions.width > 0 && sensors.length > 0 ? (
                <div className="absolute inset-0">
                  {sensors.map((sensor) => (
                    <Sensor 
                      key={sensor.id}
                      sensor={{
                        ...sensor,
                        position: adjustedSensorPosition(sensor)
                      }}
                      onClick={handleSensorClick}
                    />
                  ))}
                </div>
              ) : sensors.length === 0 ? (
                <div className={styles.noSensorsMessage}>
                  No sensors found. Check data.json file.
                </div>
              ) : null}
            </div>
          </div>
        </div>
      )}

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