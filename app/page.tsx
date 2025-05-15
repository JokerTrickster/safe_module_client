"use client";

import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import SensorStats from './components/dashboard/SensorStats';
import SensorDetails from './components/dashboard/SensorDetails';
import TestControls from './components/dashboard/TestControls';
import FloorPlan from './components/dashboard/FloorPlan';
import { useSensors } from './hooks/useSensors';
import { useAlarm } from './hooks/useAlarm';
import styles from './styles/components/layout.module.css';

export default function Home() {
  const { 
    sensors, 
    isLoading, 
    error, 
    selectedSensor, 
    updateSensorStatus, 
    selectSensor 
  } = useSensors();
  
  const { alarmActive, handleStopAlarm } = useAlarm(sensors);

  return (
    <DashboardLayout alarmActive={alarmActive} onStopAlarm={handleStopAlarm}>
      <div className={styles.sidePanel}>
        <SensorStats sensors={sensors} />
        <SensorDetails selectedSensor={selectedSensor} />
        <TestControls 
          sensors={sensors}
          selectedSensor={selectedSensor}
          onSelectSensor={selectSensor}
          onUpdateStatus={updateSensorStatus}
        />
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
      
      <FloorPlan 
        sensors={sensors}
        isLoading={isLoading}
        onSensorClick={selectSensor}
      />
    </DashboardLayout>
  );
}