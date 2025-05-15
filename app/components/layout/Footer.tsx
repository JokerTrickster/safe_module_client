import React from 'react';
import styles from '../../styles/components/layout.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <p>Sensor Monitoring Dashboard | &copy; {new Date().getFullYear()}</p>
    </footer>
  );
};

export default Footer; 