import apiClient from '../client';
import { 
  LightStatus, 
  SensorInfo, 
  SensorListResponse, 
  LightStatusResponse,
  LightControlRequest,
  LightControlResponse
} from './types';
import { AxiosResponse } from 'axios';
import axios from 'axios';

// 타입 정의 추가
export type SensorEventRequest = {
  sensor_id: string;
  status: string;
  type: string;
};

export const sensorApi = {
  // 조명 상태 조회
  getLightStatus: (sensorID: string): Promise<AxiosResponse<LightStatusResponse>> => 
    apiClient.get<LightStatusResponse>(`http://localhost:8080/v0.1/light/status?sensorID=${sensorID}`),
  
  // 센서 정보 조회
  getSensorInfo: (sensorID: string): Promise<AxiosResponse<SensorInfo>> =>
    apiClient.get<SensorInfo>(`http://localhost:8080/v0.1/sensors?sensorID=${sensorID}`),
  
  // 센서 조명 제어
  controlLight: (data: LightControlRequest): Promise<AxiosResponse<LightControlResponse>> =>
    apiClient.post<LightControlResponse>('http://localhost:8080/v0.1/sensors/light', data),
  
  // 센서 리스트 조회
  getSensorList: (): Promise<AxiosResponse<SensorListResponse>> =>
    apiClient.get<SensorListResponse>('http://localhost:8080/v0.1/sensors/list'),

  // 센서 이벤트 처리
  putSensorEvent: (data: SensorEventRequest): Promise<AxiosResponse<any>> =>
    apiClient.put('http://localhost:8080/v0.1/sensors/event', data),
};

export interface ApiSensor {
  fireDetector: string;
  lightStatus: string;
  position: { x: number; y: number };
  sensorID: string;
  sensors: {
    name: string;
    status: string;
    unit: string;
    value: number;
  }[];
}

export const fetchSensorList = async (): Promise<ApiSensor[]> => {
  const res = await axios.get('http://localhost:8080/v0.1/sensors/list');
  return res.data.sensorList;
};

export interface Threshold {
  name: string;
  unit: string;
  threshold: number;
}

export const fetchThresholdList = async (): Promise<Threshold[]> => {
  const res = await axios.get('http://localhost:8080/v0.1/sensors/threshold/list');
  return res.data.thresholdList;
}; 