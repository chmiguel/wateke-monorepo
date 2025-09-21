import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Provider } from '../Provider';

/**
 * Hook that automatically sets the navigate function in the NavigationService
 * Should be called in your main App component or router wrapper
 */
export const useNavigationService = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const navigationService = Provider.navigationService();
        navigationService.setNavigateFunction(navigate);
    }, [navigate]);
};
