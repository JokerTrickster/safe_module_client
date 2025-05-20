export type LightStatus = 'on' | 'off';
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
  name: string;
  type: 'temperature' | 'humidity' | 'pressure';
  status: SensorStatus;
  position: {
    x: number;
    y: number;
  };
} 