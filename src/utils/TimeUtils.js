import { NOT_STARTED } from '../constants/constants';

export const isTimeWithinRange = duration => {
  return duration > 0 && duration <= 60;
};

export const canUpdateTime = (duration, status) => {
  return isTimeWithinRange(duration) && status === NOT_STARTED;
};
