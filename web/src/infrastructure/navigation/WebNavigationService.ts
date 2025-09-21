import { NavigateFunction } from 'react-router-dom';
import NavigationService from '../../core/domain/navigation/NavigationService';

export default class WebNavigationService implements NavigationService {
    private navigateFunction: NavigateFunction | null = null;

    setNavigateFunction(navigate: NavigateFunction): void {
        this.navigateFunction = navigate;
    }

    navigate(path: string, options?: { replace?: boolean; state?: any }): void {
        if (!this.navigateFunction) {
            console.warn('Navigation function not set. Make sure to call setNavigateFunction from a component using useNavigate hook.');
            return;
        }

        this.navigateFunction(path, options);
    }

    goBack(): void {
        if (!this.navigateFunction) {
            console.warn('Navigation function not set. Make sure to call setNavigateFunction from a component using useNavigate hook.');
            return;
        }

        this.navigateFunction(-1);
    }
}
