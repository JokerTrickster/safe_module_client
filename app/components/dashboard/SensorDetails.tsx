import React from 'react';
import { Sensor } from '../../types';
import styles from '../../styles/components/dashboard.module.css';

interface SensorDetailsProps {
  selectedSensor: Sensor | null;
}

const SensorDetails: React.FC<SensorDetailsProps> = ({ selectedSensor }) => {
  return (
    <div className={styles.panelSection}>
      <h2 className={styles.panelTitle}>Sensor Details</h2>
      {selectedSensor ? (
        <div className={styles.sensorDetail}>
          <h3 className={styles.sensorName}>{selectedSensor.name}</h3>
          <p className={styles.sensorType}>Type: {selectedSensor.type}</p>
          <p className={styles.sensorPosition}>
            Position: X: {selectedSensor.position.x}%, Y: {selectedSensor.position.y}%
          </p>
          <p className={`${styles.sensorStatus} ${styles[`status${selectedSensor.status.charAt(0).toUpperCase() + selectedSensor.status.slice(1)}`]}`}>
            Status: {selectedSensor.status.toUpperCase()}
          </p>
        </div>
      ) : (
        <p className={styles.noSensorSelected}>Click on a sensor to view details</p>
      )}
    </div>
  );
};

export default SensorDetails; 