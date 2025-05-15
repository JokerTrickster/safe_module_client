import React from 'react';
import styles from '../../styles/components/ui.module.css';

const LoadingSpinner: React.FC = () => {
  return (
    <div className={styles.loadingContainer}>
      <div className={styles.loadingSpinner}></div>
      <p>Loading sensor data...</p>
    </div>
  );
};

export default LoadingSpinner; 