import { toast } from 'react-toastify';
import ToastService from '../../core/domain/toasts/ToastService';

export default class WebToastService implements ToastService {
  showError(message: string): void {
    toast.error(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: 'rounded bold-text',
    });
  }

  showInfo(message: string): void {
    toast.info(message, {
      position: toast.POSITION.BOTTOM_RIGHT,
      className: 'rounded bold-text',
    });
  }
}
