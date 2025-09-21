import { toast } from 'react-toastify';
import ToastService from '../../core/domain/toasts/ToastService';

export default class WebToastService implements ToastService {
  showError(message: string): void {
    toast.error(message, {
      position: 'bottom-right',
      className: 'rounded bold-text',
    });
  }

  showInfo(message: string): void {
    toast.info(message, {
      position: 'bottom-right',
      className: 'rounded bold-text',
    });
  }
}
