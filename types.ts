
export type SubscriptionPlan = 'basic' | 'premium' | 'custom';

export interface User {
  id: string;
  name: string;
  email: string;
  subscriptionPlan: SubscriptionPlan;
  subscriptionEnd: string;
}

export interface Field {
  field_id: number;
  user_id: string;
  field_name: string;
  location: string;
  size: number;
  soil_type: string;
}

export interface SensorData {
  data_id: number;
  field_id: number;
  temperature: number;
  moisture: number;
  ph_level: number;
  npk_n: number;
  npk_p: number;
  npk_k: number;
  timestamp: string;
}

export interface SensorReading {
  value?: number;
  n?: number;
  p?: number;
  k?: number;
}

export interface Sensor {
  sensor_id: number;
  field_id: number;
  sensor_type: string;
  battery_level: number;
  status: 'active' | 'inactive' | 'maintenance';
  last_active: string;
  last_reading?: SensorReading;
}

export interface CropRecommendation {
  name: string;
  suitability: number;
  yield: string;
  requirements: string;
  fertilizer: string;
  icon: string;
}
