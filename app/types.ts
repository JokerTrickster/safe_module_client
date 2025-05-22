export type SensorStatus = 'normal' | 'warning' | 'danger' | 'warmup';

export interface SensorData {
  name: string;
  value: number;
  status: SensorStatus;
}

export interface Sensor {
  id: string;
  sensor_id: string;
  name: string;
  label: string;
  type:  'co2' | 'co';
  status: SensorStatus;
  position: {
    x: number;
    y: number;
  };
  lightStatus: 'normal' | 'shutdown';
  fireDetector: 'normal' | 'detection';
  sensors: SensorData[];
}

export type SensorType = 'co2' | 'co'; 