import { memo } from 'react';

import '../scss/timer.scss';

const TimerConfig = ({ id, onChange, label, value }) => {
  return (
    <div className='timer'>
      <div className='timer-label' id={`${id}-label`}>
        {label} Length
      </div>
      <div className='timer-controls'>
        <button
          className='btn-icon material-icons-round'
          id={`${id}-decrement`}
          onClick={() => onChange(-1)}
          title='Decrement'
          aria-label='Decrement by 1 minute'
        >
          remove
        </button>
        <span className='timer-time' id={`${id}-length`}>
          {value}
        </span>
        <button
          className='btn-icon material-icons-round'
          id={`${id}-increment`}
          onClick={() => onChange(1)}
          aria-label='Increment by 1 minute'
          title='Increment'
        >
          add
        </button>
      </div>
    </div>
  );
};

export default memo(TimerConfig);
