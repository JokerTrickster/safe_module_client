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
}; 