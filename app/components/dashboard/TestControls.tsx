import React, { useEffect } from 'react';
import { Sensor, SensorStatus } from '../../types';
import styles from '../../styles/components/dashboard.module.css';

interface TestControlsProps {
  sensors: Sensor[];
  selectedSensor: Sensor | null;
  onSelectSensor: (sensor: Sensor) => void;
  onUpdateStatus: (sensorId: string, status: SensorStatus) => void;
  audioInitialized?: boolean;
}

const TestControls: React.FC<TestControlsProps> = ({
  sensors,
  selectedSensor,
  onSelectSensor,
  onUpdateStatus,
  audioInitialized = false
}) => {
  const initializeAudio = () => {
    try {
      const audio = new Audio('/sounds/emergency_bell.mp3');
      audio.volume = 0.1;
      audio.play()
        .then(() => {
          setTimeout(() => {
            audio.pause();
            audio.currentTime = 0;
          }, 500);
          console.log('Audio initialized by user action');
        })
        .catch(error => {
          console.error('Failed to initialize audio:', error);
        });
    } catch (error) {
      console.error('Error creating audio element:', error);
    }
  };

  return (
    <div className={styles.panelSection}>
      <h2 className={styles.panelTitle}>Test Controls</h2>
      <div className={styles.testControls}>
        {!audioInitialized && (
          <div className={styles.audioInitContainer}>
            <p className={styles.audioInitText}>
              브라우저 정책으로 인해 알람 소리를 활성화하려면 버튼을 클릭하세요
            </p>
            <button 
              className={styles.audioInitButton}
              onClick={initializeAudio}
            >
              알람 소리 활성화
            </button>
          </div>
        )}
        
        <div className={styles.sensorSelector}>
          <label htmlFor="sensorSelect" className={styles.sensorSelectLabel}>Select Sensor:</label>
          <select 
            id="sensorSelect" 
            className={styles.sensorSelect}
            onChange={(e) => {
              const sensor = sensors.find(s => s.id === e.target.value);
              if (sensor) onSelectSensor(sensor);
            }}
            value={selectedSensor?.id || ""}
          >
            <option value="" disabled>Choose a sensor</option>
            {sensors.map(sensor => (
              <option key={sensor.id} value={sensor.id}>
                {sensor.name} ({sensor.type})
              </option>
            ))}
          </select>
        </div>
        
        {selectedSensor && (
          <div className={styles.statusButtons}>
            <button 
              className={`${styles.statusButton} ${styles.normalButton}`}
              onClick={() => onUpdateStatus(selectedSensor.id, "normal")}
            >
              Set Normal
            </button>
            <button 
              className={`${styles.statusButton} ${styles.warningButton}`}
              onClick={() => onUpdateStatus(selectedSensor.id, "warning")}
            >
              Set Warning
            </button>
            <button 
              className={`${styles.statusButton} ${styles.dangerButton}`}
              onClick={() => onUpdateStatus(selectedSensor.id, "danger")}
            >
              Set Danger
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestControls; 