import React from 'react';
import styles from '../../styles/components/dashboard.module.css';

interface AlarmBannerProps {
  onStopAlarm: () => void;
}

const AlarmBanner: React.FC<AlarmBannerProps> = ({ onStopAlarm }) => {
  const handleClick = () => {
    console.log("Alarm stop button clicked");
    onStopAlarm();
  };

  return (
    <div className={styles.alarmBanner}>
      <span className={styles.alarmText}>⚠️ 위험 감지! 센서 경고 발생</span>
      <button 
        className={styles.alarmStopButton}
        onClick={handleClick}
      >
        알람 중지
      </button>
    </div>
  );
};

export default AlarmBanner; 