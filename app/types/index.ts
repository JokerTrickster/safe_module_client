export type SensorType = "temperature" | "humidity" | "pressure";
export type SensorStatus = "normal" | "warning" | "danger";

export interface Sensor {
  id: string;
  name: string;
  position: {
    x: number;
    y: number;
  };
  type: SensorType;
  status: SensorStatus;
} 