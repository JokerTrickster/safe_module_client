import React, { ReactNode } from 'react';
import styles from '../../styles/components/layout.module.css';
import Header from './Header';
import Footer from './Footer';

interface DashboardLayoutProps {
  children: ReactNode;
  alarmActive: boolean;
  onStopAlarm: () => void;
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ 
  children, 
  alarmActive, 
  onStopAlarm 
}) => {
  return (
    <div className={styles.dashboardContainer}>
      <Header alarmActive={alarmActive} onStopAlarm={onStopAlarm} />
      <main className={styles.mainContent}>
        {children}
      </main>
      <Footer />
    </div>
  );
};

export default DashboardLayout; 