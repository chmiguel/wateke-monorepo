import ToastService from './ToastService';

export default class ToastRepository {
  private readonly toastService: ToastService;

  constructor(toastService: ToastService) {
    this.toastService = toastService;
  }

  showError(message: string) {
    this.toastService.showError(message);
  }

  showInfo(message: string) {
    this.toastService.showInfo(message);
  }
}
