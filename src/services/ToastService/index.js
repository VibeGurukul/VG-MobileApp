
import { Toast } from 'toastify-react-native';

export const showSuccess = (message, options = {}) => {
  Toast.success(message, "bottom");
};

export const showError = (message, options = {}) => {
  Toast.error(message, "bottom");
};

export const showInfo = (message, options = {}) => {
  Toast.info(message, "bottom");

};

export const showWarning = (message, options = {}) => {
  Toast.warn(message, "bottom");

};