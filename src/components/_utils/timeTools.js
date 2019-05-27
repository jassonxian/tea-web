import Moment from 'moment';

export function momentToString(obj, style) {
  if (Array.isArray(obj)) {
    return obj.map(item => item.format(style)).join(',');
  }
  return obj.format(style);
}

export function stringToMoment(value, style) {
  if (isNaN(value) && !isNaN(Date.parse(value))) {
    return Moment(value, style);
  }
  return value;
}
