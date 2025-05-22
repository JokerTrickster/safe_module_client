import { useState, useEffect } from 'react';
import { fetchSensorList, fetchThresholdList, Threshold } from '../api/sensors';
import { mapApiSensorToAppSensor } from '../utils/sensorUtils';
import { Sensor, SensorStatus } from '../types';

export const useSensors = () => {
  const [sensors, setSensors] = useState<Sensor[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSensorId, setSelectedSensorId] = useState<string | null>(null);
  const [thresholds, setThresholds] = useState<Threshold[]>([]);

  useEffect(() => {
    let isMounted = true;
    let timer: NodeJS.Timeout;

    const load = async () => {
      try {
        const apiSensors = await fetchSensorList();
        if (isMounted) {
          setSensors(apiSensors.map(mapApiSensorToAppSensor));
          setError(null);
        }
      } catch (e) {
        if (isMounted) setError('센서 정보를 불러오지 못했습니다.');
      }
      if (isMounted) {
        timer = setTimeout(load, 500); // 0.5초 후 재호출
      }
    };

    setIsLoading(true);
    load();
    setIsLoading(false);

    return () => {
      isMounted = false;
      if (timer) clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    fetchThresholdList()
      .then(setThresholds)
      .catch(() => setThresholds([]));
  }, []);

  const updateSensorStatus = (sensorId: string, status: SensorStatus) => {
    setSensors(prev =>
      prev.map(sensor =>
        sensor.id === sensorId ? { ...sensor, status } : sensor
      )
    );
  };

  const selectSensor = (sensor: Sensor) => setSelectedSensorId(sensor.id);

  // 항상 최신 sensors에서 id로 찾아서 반환
  const currentSensor = sensors.find(s => s.id === selectedSensorId) || null;

  return {
    sensors,
    isLoading,
    error,
    selectedSensor: currentSensor,
    updateSensorStatus,
    selectSensor,
    thresholds,
  };
}; 