import { Sensor, SensorType, SensorStatus } from '../types';

export const mockSensors: Sensor[] = [
  { id: "1", name: "Sensor 1", position: { x: 130, y: 30 }, type: "temperature", status: "normal" },
  { id: "2", name: "Sensor 2", position: { x: 50, y: 40 }, type: "humidity", status: "normal" },
  { id: "3", name: "Sensor 3", position: { x: 70, y: 60 }, type: "pressure", status: "normal" },
];

export const getSensorsByType = (sensors: Sensor[], type: SensorType): Sensor[] => {
  return sensors.filter(sensor => sensor.type === type);
};

export const getSensorsByStatus = (sensors: Sensor[], status: SensorStatus): Sensor[] => {
  return sensors.filter(sensor => sensor.status === status);
}; 