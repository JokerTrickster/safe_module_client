"use client";

import React, { useState } from 'react';
import DashboardLayout from './components/layout/DashboardLayout';
import SensorStats from './components/dashboard/SensorStats';
import SensorDetails from './components/dashboard/SensorDetails';
import FloorPlan from './components/dashboard/FloorPlan';
import { useSensors } from './hooks/useSensors';
import styles from './styles/components/layout.module.css';
import { Sensor as SensorType } from './api/sensors/types';

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

  const [selectedSensorState, setSelectedSensorState] = useState<SensorType | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSensorClick = (sensor: SensorType) => {
    setSelectedSensorState(sensor);
    setIsModalOpen(true);
  };

  return (
    <DashboardLayout
      sensors={sensors}
      thresholds={thresholds}
      onStatusChange={updateSensorStatus}
    >
      <div className={styles.sidePanel}>
        <SensorStats sensors={sensors} thresholds={thresholds} />
        <SensorDetails selectedSensor={selectedSensorState} thresholds={thresholds} />
  
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
          onSensorClick={handleSensorClick}
          selectedSensor={selectedSensorState}
          setSelectedSensor={setSelectedSensorState}
          isModalOpen={isModalOpen}
          setIsModalOpen={setIsModalOpen}
        />
      </div>
    </DashboardLayout>
  );
}