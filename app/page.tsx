"use client";

import React from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import SensorStats from './components/dashboard/SensorStats';
import SensorDetails from './components/dashboard/SensorDetails';
import FloorPlan from './components/dashboard/FloorPlan';
import { useSensors } from './hooks/useSensors';
import styles from './styles/components/layout.module.css';

export default function Home() {
  const { 
    sensors, 
    isLoading, 
    error, 
    selectedSensor, 
    updateSensorStatus, 
    selectSensor, 
    thresholds 
  } = useSensors();

  return (
    <DashboardLayout
      sensors={sensors}
      thresholds={thresholds}
      onStatusChange={updateSensorStatus}
    >
      <div className={styles.sidePanel}>
        <SensorStats sensors={sensors} thresholds={thresholds} />
        <SensorDetails selectedSensor={selectedSensor} thresholds={thresholds} />
  
        
        {error && (
          <div className={styles.errorMessage}>
            {error}
          </div>
        )}
      </div>
      
      <div className="relative flex-1">
        <FloorPlan 
          sensors={sensors}
          isLoading={isLoading}
          onSensorClick={selectSensor}
          onStatusChange={updateSensorStatus}
        />
      </div>
    </DashboardLayout>
  );
}