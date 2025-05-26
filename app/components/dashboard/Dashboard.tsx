import React, { useState } from 'react';
import FloorPlan from './FloorPlan';
import SensorStats from './SensorStats';
import AlarmBanner from './AlarmBanner';
import { useAlarm } from '../../hooks/useAlarm';
import { mockSensors } from '../../utils/sensorUtils';
import { Sensor } from '../../api/sensors/types';

const thresholds = [
  { name: 'co2', threshold: 3000 },
  { name: 'co', threshold: 500 }
];

const Dashboard: React.FC = () => {
  const [sensors, setSensors] = useState<Sensor[]>(mockSensors);
  const [selectedSensor, setSelectedSensor] = useState<Sensor | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { 
    alarmActive, 
    handleStopAlarm, 
    audioInitialized,
    dangerSensors 
  } = useAlarm(sensors);

  const handleStatusChange = (sensorId: string, status: 'normal' | 'warning' | 'danger') => {
    setSensors(prevSensors => 
      prevSensors.map(sensor => 
        sensor.id === sensorId 
          ? { ...sensor, status }
          : sensor
      )
    );
  };

  const handleSensorClick = (sensor: Sensor) => {
    setSelectedSensor(sensor);
    setIsModalOpen(true);
  };

  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="flex flex-row h-[900px] max-w-[1400px] mx-auto py-8">
        {/* 사이드 패널: 왼쪽에 고정 */}
        <aside className="w-80 flex-shrink-0 h-full">
          <SensorStats sensors={sensors} thresholds={thresholds} />
        </aside>
        {/* 메인 컨텐츠: 이미지 중앙 정렬 */}
        <main className="flex-1 flex items-center justify-center h-full">
          <div className="bg-white rounded-lg shadow-lg p-6 flex items-center justify-center" style={{ width: 1200, height: 900 }}>
            <FloorPlan
              sensors={sensors}
              isLoading={false}
              onSensorClick={handleSensorClick}
              onStatusChange={handleStatusChange}
              selectedSensor={selectedSensor}
              setSelectedSensor={setSelectedSensor}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
            />
          </div>
        </main>
      </div>
      <AlarmBanner
        onStopAlarm={handleStopAlarm}
        dangerSensors={dangerSensors}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
};

export default Dashboard; 