import React from 'react';
import { Sensor as SensorType } from '../../types';
import styles from '../../styles/components/dashboard.module.css';

interface SensorProps {
  sensor: SensorType;
  onClick: (sensor: SensorType) => void;
}

const Sensor: React.FC<SensorProps> = ({ sensor, onClick }) => {
  const getSensorTypeClass = (type: string) => {
    switch (type) {
      case "temperature":
        return styles.temperatureSensor;
      case "humidity":
        return styles.humiditySensor;
      case "pressure":
        return styles.pressureSensor;
      default:
        return styles.defaultSensor;
    }
  };
  
  const getSensorStatusClass = (status: string) => {
    switch (status) {
      case "warning":
        return styles.warningSensor;
      case "danger":
        return styles.dangerSensor;
      default:
        return "";
    }
  };

  return (
    <div
      className={`${styles.sensor} ${getSensorTypeClass(sensor.type)} ${getSensorStatusClass(sensor.status)}`}
      style={{
        left: `${sensor.position.x}%`,
        top: `${sensor.position.y}%`,
      }}
      onClick={() => onClick(sensor)}
      onKeyDown={(e) => e.key === 'Enter' && onClick(sensor)}
      aria-label={`Sensor: ${sensor.name}, Type: ${sensor.type}, Status: ${sensor.status}`}
      tabIndex={0}
      role="button"
      title={`${sensor.name} (${sensor.type}) - ${sensor.status}`}
    />
  );
};

export default Sensor; 