import React, { useEffect, useRef, useState } from 'react';
import TimerConfig from './components/TimerConfig';
import {
  ACTIVE,
  BREAK_LABEL,
  INIT_BREAK_TIME,
  INIT_SESSION_TIME,
  NOT_STARTED,
  PAUSED,
  SESSION_LABEL,
} from './constants/constants';
import Display from './components/Display';
import { canUpdateTime } from './utils/TimeUtils';
import { resetAudio, resetAudioAndPlay } from './utils/AudioUtils';
import { addBodyClass, removeBodyClass } from './utils/DOMUtils';
import beep from './audios/beep.mp3';

const changeToWorkMode = () => {
  addBodyClass('work');
  removeBodyClass('break');
};

const changeToBreakMode = () => {
  addBodyClass('break');
  removeBodyClass('work');
};

const resetMode = () => {
  removeBodyClass('work');
  removeBodyClass('break');
};

const App = () => {
  const [sessionTime, setSessionTime] = useState(INIT_SESSION_TIME);
  const [breakTime, setBreakTime] = useState(INIT_BREAK_TIME);
  const [currentTimerLabel, setCurrentTimerLabel] = useState(SESSION_LABEL);
  const [currentTimer, setCurrentTimer] = useState();
  const [time, setTime] = useState({ minutes: INIT_SESSION_TIME, seconds: 0 });
  const [status, setStatus] = useState(NOT_STARTED);
  const audioRef = useRef(null);

  useEffect(() => {
    if (status !== ACTIVE) {
      return;
    }
    if (time.seconds === 0) {
      if (time.minutes <= 0) {
        if (currentTimerLabel === SESSION_LABEL) {
          setCurrentTimerLabel(BREAK_LABEL);
          setTime({ minutes: breakTime, seconds: 0 });
          changeToBreakMode();
        } else {
          setCurrentTimerLabel(SESSION_LABEL);
          setTime({ minutes: sessionTime, seconds: 0 });
          changeToWorkMode();
        }
        resetAudioAndPlay(audioRef.current);
      }
    }
  }, [status, breakTime, currentTimerLabel, sessionTime, time.seconds, time.minutes]);

  useEffect(() => {
    if (status !== ACTIVE) {
      return;
    }
    const int = setInterval(() => {
      if (time.seconds === 0) {
        setTime(t => ({ minutes: t.minutes - 1, seconds: 59 }));
      } else {
        setTime(t => ({ ...t, seconds: t.seconds - 1 }));
      }
    }, 1000);

    setCurrentTimer(int);

    return () => clearInterval(int);
  }, [status, time.seconds, time.minutes]);

  const changeSessionDuration = offset => {
    const newTime = sessionTime + offset;
    if (!canUpdateTime(newTime, status)) {
      return;
    }
    setSessionTime(newTime);
    setTime({ seconds: 0, minutes: newTime });
  };

  const changeBreakDuration = offset => {
    const newTime = breakTime + offset;
    if (!canUpdateTime(newTime, status)) {
      return;
    }
    setBreakTime(newTime);
  };

  const start = () => {
    setStatus(ACTIVE);
    changeToWorkMode();
  };

  const pause = () => {
    setStatus(PAUSED);
    clearInterval(currentTimer);
    resetAudio(audioRef.current);
  };

  const reset = () => {
    setSessionTime(INIT_SESSION_TIME);
    setBreakTime(INIT_BREAK_TIME);
    setStatus(NOT_STARTED);
    setCurrentTimerLabel(SESSION_LABEL);
    setTime({ minutes: INIT_SESSION_TIME, seconds: 0 });
    clearInterval(currentTimer);
    resetAudio(audioRef.current);
    resetMode();
  };

  const toggleStartPause = () => {
    status === ACTIVE ? pause() : start();
  };

  return (
    <>
      <h1 className='title'>25 + 5 Clock</h1>
      <main className='main'>
        <div className='configurations'>
          <TimerConfig id='break' label={BREAK_LABEL} value={breakTime} onChange={changeBreakDuration} />
          <TimerConfig id='session' label={SESSION_LABEL} value={sessionTime} onChange={changeSessionDuration} />
        </div>
        <Display label={currentTimerLabel} minutes={time.minutes} seconds={time.seconds} />
        <div className='actions'>
          <button
            onClick={toggleStartPause}
            className='btn-icon xl material-icons-round'
            id='start_stop'
            aria-label={(status === 'ACTIVE' ? 'Pause' : status === 'NOT_STARTED' ? 'Start' : 'Resume') + ' Timer'}
            title={(status === 'ACTIVE' ? 'Pause' : status === 'NOT_STARTED' ? 'Start' : 'Resume') + ' Timer'}
          >
            {status === 'ACTIVE' ? 'pause' : 'play_arrow'}
          </button>
          <button
            className='btn-icon xl material-icons-round'
            onClick={reset}
            id='reset'
            aria-label='Reset Timer'
            title='Reset Timer'
          >
            refresh
          </button>
        </div>
        <audio id='beep' src={beep} ref={audioRef} />
      </main>
    </>
  );
};

export default App;
