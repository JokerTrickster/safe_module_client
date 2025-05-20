import React from 'react';
import { Bell, Settings, User } from 'lucide-react';
import Header from './Header';
import { useAlarm } from '../../hooks/useAlarm';
import { Sensor } from '../../types';

interface DashboardLayoutProps {
  children: React.ReactNode;
  sensors: Sensor[];
}

const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children, sensors }) => {
  const { alarmActive, handleStopAlarm, dangerSensors } = useAlarm(sensors);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        alarmActive={alarmActive}
        onStopAlarm={handleStopAlarm}
        dangerSensors={dangerSensors}
      />

      {/* 메인 컨텐츠 */}
      <main className="max-w-7xl px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex gap-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout; 