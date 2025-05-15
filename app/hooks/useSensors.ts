import { useState, useEffect } from 'react';
import { Sensor, SensorStatus } from '../types';
import { mockSensors } from '../utils/sensorUtils';

export const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        console.log("Fetching sensor data...");
        const response = await fetch('/data.json');
        
        if (!response.ok) {
          throw new Error(`Failed to fetch: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log("Data loaded:", data);
        
        if (data.sensors && Array.isArray(data.sensors)) {
          // Add status field if it doesn't exist
          const sensorsWithStatus = data.sensors.map((sensor: any) => ({
            ...sensor,
            status: sensor.status || "normal"
          }));
          setSensors(sensorsWithStatus);
        } else {
          console.warn("No sensors found in data, using mock data");
          setSensors(mockSensors);
        }
      } catch (error) {
        console.error("Error loading sensor data:", error);
        setError("Failed to load sensor data. Using mock data instead.");
        setSensors(mockSensors);
      } finally {
        setIsLoading(false);
      }
    };

    fetchSensors();
  }, []);

  const updateSensorStatus = (sensorId: string, status: SensorStatus) => {
    setSensors(prevSensors => 
      prevSensors.map(sensor => 
        sensor.id === sensorId ? { ...sensor, status } : sensor
      )
    );
  };

  const selectSensor = (sensor: Sensor) => {
    setSelectedSensor(sensor);
  };

  return {
    sensors,
    isLoading,
    error,
    selectedSensor,
    updateSensorStatus,
    selectSensor
  };
}; 