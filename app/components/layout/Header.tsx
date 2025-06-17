import React from 'react';
import styles from '../../styles/components/layout.module.css';
import AlarmBanner from '../dashboard/AlarmBanner';
import { Sensor } from '../../api/sensors/types';

interface HeaderProps {
  alarmActive: boolean;
  onStopAlarm: (sensorId: string) => void;
  dangerSensors: Sensor[];
  onStatusChange: (sensorId: string, status: 'normal' | 'warning' | 'danger') => void;
}

const Header: React.FC<HeaderProps> = ({
  alarmActive,
  onStopAlarm,
  dangerSensors,
  onStatusChange
}) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.dashboardTitle}>3D Safe Module Dashboard</h1>
      {alarmActive && (
        <AlarmBanner
          sensors={dangerSensors}
          onStopAlarm={onStopAlarm}
          dangerSensors={dangerSensors}
          onStatusChange={onStatusChange}
        />
      )}
    </header>
  );
};

export default Header; 