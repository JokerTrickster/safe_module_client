import React from 'react';
import styles from '../../styles/components/layout.module.css';
import AlarmBanner from '../dashboard/AlarmBanner';
import { Sensor } from '../../types';

interface HeaderProps {
  alarmActive: boolean;
  onStopAlarm: (sensorId: string) => void;
  dangerSensors: Array<{
    id: string;
    name: string;
    type: string;
  }>;
}

const Header: React.FC<HeaderProps> = ({ alarmActive, onStopAlarm, dangerSensors }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.dashboardTitle}>3D Floor Plan Monitoring Dashboard</h1>
      {alarmActive && (
        <AlarmBanner 
          onStopAlarm={onStopAlarm} 
          dangerSensors={dangerSensors}
        />
      )}
    </header>
  );
};

export default Header; 