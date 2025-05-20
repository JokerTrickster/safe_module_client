let alarmSound: HTMLAudioElement | null = null;

export const playAlarm = (isActive: boolean): void => {
  if (!isActive) {
    stopAlarm();
    return;
  }
  
  if (typeof window === 'undefined') return;
  
  try {
    if (!alarmSound) {
      // emergency_bell.mp3 파일 사용
      alarmSound = new Audio('/sounds/emergency_bell.mp3');
      alarmSound.loop = true; // 반복 재생 설정
    }
    
    // 이미 재생 중이면 다시 시작하지 않음
    if (alarmSound.paused) {
      console.log("Playing emergency bell alarm");
      const playPromise = alarmSound.play();
      
      if (playPromise !== undefined) {
        playPromise.catch(error => {
          console.error("Error playing emergency bell:", error);
          fallbackAlarm(isActive); // 재생 실패 시 대체 알람 사용
        });
      }
    }
  } catch (error) {
    console.error("Error setting up emergency bell:", error);
    fallbackAlarm(isActive);
  }
};

export const stopAlarm = (): void => {
  console.log("Stopping emergency bell alarm1111111111111111111111111111111111");
  if (alarmSound) {
    alarmSound.pause();
    alarmSound.currentTime = 0;
  }
  
  // 대체 알람도 중지
  if (alarmInterval) {
    clearInterval(alarmInterval);
    alarmInterval = null;
  }
};

// 오디오 파일 재생이 실패할 경우 Web Audio API로 대체
let audioContext: AudioContext | null = null;
let alarmInterval: NodeJS.Timeout | null = null;

const fallbackAlarm = (isActive: boolean): void => {
  if (!isActive) {
    if (alarmInterval) {
      clearInterval(alarmInterval);
      alarmInterval = null;
    }
    return;
  }
  
  if (typeof window === 'undefined') return;
  
  try {
    if (!audioContext) {
      audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    
    const createBeep = () => {
      if (!audioContext) return;
      
      const oscillator = audioContext.createOscillator();
      const gain = audioContext.createGain();
      
      oscillator.connect(gain);
      gain.connect(audioContext.destination);
      
      oscillator.type = 'triangle';
      oscillator.frequency.value = 800;
      gain.gain.value = 0.3;
      
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.3);
    };
    
    createBeep();
    
    if (!alarmInterval) {
      alarmInterval = setInterval(() => {
        if (isActive) {
          createBeep();
        } else {
          if (alarmInterval) {
            clearInterval(alarmInterval);
            alarmInterval = null;
          }
        }
      }, 1000);
    }
  } catch (error) {
    console.error("Error with fallback alarm:", error);
  }
};

// 다양한 경고음 레벨 지원
export enum AlarmLevel {
  WARNING = 'warning',
  DANGER = 'danger',
  CRITICAL = 'critical'
}

let warningSound: HTMLAudioElement | null = null;
let dangerSound: HTMLAudioElement | null = null;
let criticalSound: HTMLAudioElement | null = null;
let currentAlarm: HTMLAudioElement | null = null;

export const playAlarmByLevel = (level: AlarmLevel, isActive: boolean): void => {
  if (!isActive) {
    stopAlarm();
    return;
  }
  
  if (typeof window === 'undefined') return;
  
  try {
    stopAlarm(); // 기존 알람 중지
    
    let sound: HTMLAudioElement | null = null;
    
    switch (level) {
      case AlarmLevel.WARNING:
        if (!warningSound) warningSound = new Audio('/sounds/warning.mp3');
        sound = warningSound;
        break;
      case AlarmLevel.DANGER:
        if (!dangerSound) dangerSound = new Audio('/sounds/danger.mp3');
        sound = dangerSound;
        break;
      case AlarmLevel.CRITICAL:
        if (!criticalSound) criticalSound = new Audio('/sounds/critical.mp3');
        sound = criticalSound;
        break;
    }
    
    if (sound) {
      sound.loop = true;
      currentAlarm = sound;
      sound.play().catch(error => {
        console.error(`Error playing ${level} alarm:`, error);
        fallbackAlarm(isActive);
      });
    }
  } catch (error) {
    console.error("Error setting up alarm sound:", error);
    fallbackAlarm(isActive);
  }
}; 