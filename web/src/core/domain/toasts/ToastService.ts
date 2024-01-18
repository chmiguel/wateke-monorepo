export default interface ToastService {
  showError(message: string): void;
  showInfo(message: string): void;
}
