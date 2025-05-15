import React from 'react';
import styles from '../../styles/components/layout.module.css';
import AlarmBanner from '../dashboard/AlarmBanner';

interface HeaderProps {
  alarmActive: boolean;
  onStopAlarm: () => void;
}

const Header: React.FC<HeaderProps> = ({ alarmActive, onStopAlarm }) => {
  return (
    <header className={styles.header}>
      <h1 className={styles.dashboardTitle}>3D Floor Plan Monitoring Dashboard</h1>
      {alarmActive && <AlarmBanner onStopAlarm={onStopAlarm} />}
    </header>
  );
};

export default Header; 