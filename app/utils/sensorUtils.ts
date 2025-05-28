import { Sensor, SensorStatus } from '../api/sensors/types';
import { ApiSensor } from '../api/sensors';

export const mockSensors: Sensor[] = [
  { 
    id: "1", 
    sensor_id: "30:ED:A0:BA:13:20", 
    name: "Sensor 1",
    label: "Sensor 1",
    position: { x: 130, y: 30 }, 
    type: "co2", 
    status: "normal",
    lightStatus: "on",
    fireDetector: "normal",
    motionDetection: "normal",
    sensors: [
      {
        name: "co2",
        value: 450,
        status: "normal"
      },
      {
        name: "co",
        value: 0,
        status: "normal"
      }
    ]
  },
  { 
    id: "2", 
    sensor_id: "30:ED:A0:BA:13:21", 
    name: "Sensor 2",
    label: "Sensor 2",
    position: { x: 50, y: 40 }, 
    type: "co2", 
    status: "normal",
    lightStatus: "on",
    fireDetector: "normal",
    motionDetection: "normal",
    sensors: [
      {
        name: "co2",
        value: 600,
        status: "normal"
      },
      {
        name: "co",
        value: 2,
        status: "normal"
      }
    ]
  },
  { 
    id: "3", 
    sensor_id: "30:ED:A0:BA:13:22", 
    name: "Sensor 3",
    label: "Sensor 3",
    position: { x: 70, y: 60 }, 
    type: "co2", 
    status: "normal",
    lightStatus: "off",
    fireDetector: "normal",
    motionDetection: "normal",
    sensors: [
      {
        name: "co2",
        value: 800,
        status: "normal"
      },
      {
        name: "co",
        value: 3,
        status: "normal"
      }
    ]
  }
];

export const getSensorsByType = (sensors: Sensor[], type: Sensor['type']): Sensor[] => {
  return sensors.filter(sensor => sensor.type === type);
};

export const getSensorsByStatus = (sensors: Sensor[], status: SensorStatus): Sensor[] => {
  return sensors.filter(sensor => sensor.status === status);
};

export const mapApiSensorToAppSensor = (apiSensor: ApiSensor): Sensor & { fireDetector: string } => ({
  id: apiSensor.sensorID,
  sensor_id: apiSensor.sensorID,
  name: apiSensor.sensors[0]?.name || apiSensor.sensorID,
  label: apiSensor.sensors[0]?.name || apiSensor.sensorID,
  type: (apiSensor.sensors[0]?.name as Sensor['type']) || 'co2',
  status: (apiSensor.sensors[0]?.status as SensorStatus) || 'normal',
  position: apiSensor.position,
  lightStatus: apiSensor.lightStatus === 'on' || apiSensor.lightStatus === 'off' || apiSensor.lightStatus === 'shutdown' ? apiSensor.lightStatus : 'on',
  fireDetector: apiSensor.fireDetector as 'normal' | 'detection',
  motionDetection: apiSensor.motionDetection as 'normal' | 'detection',
  sensors: apiSensor.sensors.map(s => ({
    name: s.name,
    value: s.value,
    status: s.status as SensorStatus,
    unit: s.unit,
  })),
}); 