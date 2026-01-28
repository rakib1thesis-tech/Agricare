
import { Field, SensorData, Sensor } from './types';

export const MOCK_FIELDS: Field[] = [
  { field_id: 1, user_id: '1', field_name: 'Bogura Potato Project', location: 'Bogura, Bangladesh', size: 12.5, soil_type: 'Loamy' },
  { field_id: 2, user_id: '1', field_name: 'Rajshahi Mango Orchard', location: 'Rajshahi, Bangladesh', size: 45.0, soil_type: 'Alluvial' },
  { field_id: 3, user_id: '1', field_name: 'Mymensingh Paddy Field', location: 'Mymensingh, Bangladesh', size: 8.2, soil_type: 'Clay' },
];

export const generateMockSensorData = (fieldId: number): SensorData[] => {
  const data: SensorData[] = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    data.push({
      data_id: Math.random(),
      field_id: fieldId,
      temperature: 24 + Math.random() * 8,
      moisture: 40 + Math.random() * 30,
      ph_level: 5.5 + Math.random() * 1.5,
      npk_n: 35 + Math.random() * 25,
      npk_p: 25 + Math.random() * 20,
      npk_k: 45 + Math.random() * 30,
      timestamp: date.toISOString().split('T')[0],
    });
  }
  return data;
};

export const MOCK_SENSORS: Sensor[] = [
  { sensor_id: 101, field_id: 1, sensor_type: 'Temperature', battery_level: 85, status: 'active', last_active: new Date().toISOString() },
  { sensor_id: 102, field_id: 1, sensor_type: 'NPK Analyzer', battery_level: 42, status: 'active', last_active: new Date().toISOString() },
  { sensor_id: 103, field_id: 2, sensor_type: 'Moisture', battery_level: 95, status: 'active', last_active: new Date().toISOString() },
  { sensor_id: 104, field_id: 3, sensor_type: 'pH Sensor', battery_level: 12, status: 'inactive', last_active: new Date().toISOString() },
];
