import React from 'react';
import { Sensor } from '../../types';
import { getSensorsByType, getSensorsByStatus } from '../../utils/sensorUtils';
import styles from '../../styles/components/dashboard.module.css';

interface SensorStatsProps {
  sensors: Sensor[];
}

const SensorStats: React.FC<SensorStatsProps> = ({ sensors }) => {
  return (
    <div className={styles.panelSection}>
      <h2 className={styles.panelTitle}>Sensors Overview</h2>
      <div className={styles.sensorStats}>
        <div className={styles.statCard}>
          <span className={styles.statValue}>{sensors.length}</span>
          <span className={styles.statLabel}>Total Sensors</span>
        </div>
        <div className={`${styles.statCard} ${styles.normalStatCard}`}>
          <span className={styles.statValue}>
            {getSensorsByStatus(sensors, "normal").length}
          </span>
          <span className={styles.statLabel}>Normal</span>
        </div>
        <div className={`${styles.statCard} ${styles.warningStatCard}`}>
          <span className={styles.statValue}>
            {getSensorsByStatus(sensors, "warning").length}
          </span>
          <span className={styles.statLabel}>Warning</span>
        </div>
        <div className={`${styles.statCard} ${styles.dangerStatCard}`}>
          <span className={styles.statValue}>
            {getSensorsByStatus(sensors, "danger").length}
          </span>
          <span className={styles.statLabel}>Danger</span>
        </div>
      </div>
    </div>
  );
};

export default SensorStats; 