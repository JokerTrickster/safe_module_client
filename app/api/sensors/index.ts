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

export const sensorApi = {
  // 조명 상태 조회
  getLightStatus: (sensorID: string): Promise<AxiosResponse<LightStatusResponse>> => 
    apiClient.get<LightStatusResponse>(`/v0.1/light/status?sensorID=${sensorID}`),
  
  // 센서 정보 조회
  getSensorInfo: (sensorID: string): Promise<AxiosResponse<SensorInfo>> =>
    apiClient.get<SensorInfo>(`/v0.1/sensors?sensorID=${sensorID}`),
  
  // 센서 조명 제어
  controlLight: (data: LightControlRequest): Promise<AxiosResponse<LightControlResponse>> =>
    apiClient.post<LightControlResponse>('/v0.1/sensors/light', data),
  
  // 센서 리스트 조회
  getSensorList: (): Promise<AxiosResponse<SensorListResponse>> =>
    apiClient.get<SensorListResponse>('/v0.1/sensors/list'),
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