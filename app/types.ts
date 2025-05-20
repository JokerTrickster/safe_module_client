export type SensorStatus = 'normal' | 'warning' | 'danger';

export interface Sensor {
  id: string;
  sensor_id: string;
  name: string;
  type: 'temperature' | 'humidity' | 'co2' | 'pressure';
  status: SensorStatus;
  position: {
    x: number;
    y: number;
  };
}

export type SensorType = 'temperature' | 'humidity' | 'co2' | 'pressure'; 