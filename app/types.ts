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
  type: 'temperature' | 'humidity' | 'co2' | 'co';
  status: SensorStatus;
  position: {
    x: number;
    y: number;
  };
  lightStatus: 'on' | 'off';
  sensors: SensorData[];
}

export type SensorType = 'temperature' | 'humidity' | 'co2' | 'co'; 