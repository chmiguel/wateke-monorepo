import { NavigateFunction } from 'react-router-dom';

export default abstract class NavigationService {
    abstract navigate(path: string, options?: { replace?: boolean; state?: any }): void;
    abstract goBack(): void;
    abstract setNavigateFunction(navigate: NavigateFunction): void;
}
