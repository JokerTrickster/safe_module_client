export type LightStatus = 'on' | 'off' | 'error';
export type SensorStatus = 'normal' | 'warmup' | 'warning' | 'danger';

export interface SensorData {
  name: string;
  status: SensorStatus;
  value: number;
}

export interface SensorInfo {
  lightStatus: string;
  sensorID: string;
  sensors: SensorData[];
}

export interface SensorListResponse {
  sensorList: {
    sensorID: string;
    lightStatus: string;
    motionDetection: string;
    sensors: SensorData[];
  }[];
}

export interface LightStatusResponse {
  status: LightStatus;
}

export interface LightControlRequest {
  sensorID: string;
  status: LightStatus;
}

export interface LightControlResponse {
  lightStatus: string;
  sensorID: string;
}

export interface Sensor {
  id: string;
  sensor_id: string;
  label?: string;
  name: string;
  type: 'co2' | 'co';
  status: SensorStatus;
  position: {
    x: number;
    y: number;
  };
  lightStatus: LightStatus;
  fireDetector: 'detection' | 'normal';
  sensors: SensorData[];
  motionDetection: 'detection' | 'normal';
} 