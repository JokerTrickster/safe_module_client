import { sensorApi, SensorEventRequest } from '@/api/sensors';
import { 
  LightStatus, 
  SensorInfo, 
  SensorListResponse,
  LightStatusResponse,
  LightControlRequest,
  LightControlResponse
} from '@/api/sensors/types';
import { AxiosError } from 'axios';

// 조명 제어 요청 타입 추가
interface LightToggleRequest {
  sensorID: string;
  status: 'on' | 'off';
}

export const sensorService = {
  async getLightStatus(sensorID: string): Promise<LightStatusResponse> {
    try {
      const response = await sensorApi.getLightStatus(sensorID);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch light status:', error);
      throw error;
    }
  },

  async getSensorInfo(sensorID: string): Promise<SensorInfo> {
    try {
      const response = await sensorApi.getSensorInfo(sensorID);
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sensor info:', error);
      throw error;
    }
  },

  async controlLight(data: LightControlRequest): Promise<LightControlResponse> {
    try {
      const response = await sensorApi.controlLight(data);
      return response.data;
    } catch (error) {
      console.error('Failed to control light:', error);
      throw error;
    }
  },

  async getSensorList(): Promise<SensorListResponse> {
    try {
      const response = await sensorApi.getSensorList();
      return response.data;
    } catch (error) {
      console.error('Failed to fetch sensor list:', error);
      throw error;
    }
  },

  async putSensorEvent(data: SensorEventRequest): Promise<any> {
    try {
      const response = await sensorApi.putSensorEvent(data);
      return response.data;
    } catch (error) {
      console.error('Failed to put sensor event:', error);
      throw error;
    }
  },

  async toggleLight(data: LightToggleRequest): Promise<any> {
    try {
      const response = await sensorApi.toggleLight(data);
      console.log('toggle light response', response.data);
      return response.data;
    } catch (error) {
      console.log('Failed to toggle light:', error);
      throw error;
    }
  },
}; 