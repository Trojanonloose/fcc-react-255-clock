import '../scss/display.scss';
import { memo } from 'react';

const formatTime = num => {
  return num > 9 ? num : '0' + num;
};

const Display = ({ label, minutes, seconds }) => {
  return (
    <div className='display'>
      <h2 className='display-label' id='timer-label'>
        {label}
      </h2>
      <span className='display-time-left' id='time-left'>
        {formatTime(minutes)}:{formatTime(seconds)}
      </span>
    </div>
  );
};

export default memo(Display);
