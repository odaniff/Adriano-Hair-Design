import { Notification } from 'rsuite';
import 'rsuite/dist/rsuite.min.css';  // Alternativa moderna;

export const notification = (type, params) => {
  Notification[type](params);
};