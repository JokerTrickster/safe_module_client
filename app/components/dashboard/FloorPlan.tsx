import React from 'react';
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
  return (
    <div className={styles.mapContainer}>
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className={styles.floorPlanContainer}>
          <Image 
            src="/3d.png" 
            alt="3D Floor Plan"
            width={1200}
            height={800}
            className={styles.floorPlanImage}
          />
          
          {sensors.length > 0 ? (
            sensors.map((sensor) => (
              <Sensor 
                key={sensor.id}
                sensor={sensor}
                onClick={onSensorClick}
              />
            ))
          ) : (
            <div className={styles.noSensorsMessage}>
              No sensors found. Check data.json file.
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FloorPlan; 