import { useState, useEffect } from 'react';
import { fetchSensorList, ApiSensor } from '../api/sensors';
import { mapApiSensorToAppSensor } from '../utils/sensorUtils';
import { Sensor, SensorStatus } from '../types';

export const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      try {
        const apiSensors = await fetchSensorList();
        setSensors(apiSensors.map(mapApiSensorToAppSensor));
        setError(null);
      } catch (e) {
        setError('센서 정보를 불러오지 못했습니다.');
      }
      setIsLoading(false);
    };
    load();
  }, []);

  const updateSensorStatus = (sensorId: string, status: SensorStatus) => {
    setSensors(prev =>
      prev.map(sensor =>
        sensor.id === sensorId ? { ...sensor, status } : sensor
      )
    );
  };

  const selectSensor = (sensor: Sensor) => setSelectedSensor(sensor);

  return {
    sensors,
    isLoading,
    error,
    selectedSensor,
    updateSensorStatus,
    selectSensor,
  };
}; 