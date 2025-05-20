import { useState, useEffect } from 'react';
import { Sensor } from '../types';
import { playAlarm, stopAlarm } from '../utils/alarmUtils';

export const useAlarm = (sensors: Sensor[]) => {
  const [alarmActive, setAlarmActive] = useState(false);
  const [audioInitialized, setAudioInitialized] = useState(false);
  const [acknowledgedSensors, setAcknowledgedSensors] = useState<Set<string>>(new Set());

  // 알람 소리 초기화 (사용자 상호작용 후)
  useEffect(() => {
    const initAudio = () => {
      try {
        // 빈 오디오 객체 생성 (브라우저 정책 우회)
        const audio = new Audio('/sounds/emergency_bell.mp3');
        audio.volume = 0;
        
        // 사용자 상호작용으로 오디오 컨텍스트 활성화
        const playPromise = audio.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log('Audio context initialized successfully');
              audio.pause();
              audio.currentTime = 0;
              setAudioInitialized(true);
            })
            .catch(error => {
              console.log('Audio initialization failed:', error);
            });
        }
      } catch (error) {
        console.error('Error initializing audio:', error);
      }
    };

    // 문서에 클릭 이벤트 리스너 추가
    document.addEventListener('click', initAudio, { once: true });
    
    return () => {
      document.removeEventListener('click', initAudio);
    };
  }, []);

  // 위험 센서 목록 관리
  const dangerSensors = sensors.filter(sensor => 
    sensor.status === "danger" && !acknowledgedSensors.has(sensor.id)
  );

  // 센서 상태 모니터링 및 알람 활성화
  useEffect(() => {
    if (dangerSensors.length > 0 && !alarmActive) {
      console.log("Danger detected, activating alarm");
      setAlarmActive(true);
      playAlarm(true);
    } else if (dangerSensors.length === 0 && alarmActive) {
      console.log("No danger detected, deactivating alarm");
      setAlarmActive(false);
      stopAlarm();
    }
  }, [dangerSensors, alarmActive]);

  // 알람 수동 중지 핸들러
  const handleStopAlarm = (sensorId: string) => {
    console.log(`Manual alarm stop requested for sensor ${sensorId}`);
    setAcknowledgedSensors(prev => {
      const newSet = new Set(prev);
      newSet.add(sensorId);
      return newSet;
    });

    // 모든 위험 센서가 확인되었는지 체크
    const remainingDangerSensors = dangerSensors.filter(sensor => sensor.id !== sensorId);
    if (remainingDangerSensors.length === 0) {
      setAlarmActive(false);
      stopAlarm();
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      stopAlarm();
    };
  }, []);

  return {
    alarmActive,
    handleStopAlarm,
    audioInitialized,
    dangerSensors
  };
}; 