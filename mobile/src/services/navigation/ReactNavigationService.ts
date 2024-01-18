import {StackActions} from '@react-navigation/native';
import NavigationService from '../../../../core/domain/navigation/NavigationService';
import {navigationRef} from '../../RootNavigation';

export default class ReactNavigationService implements NavigationService {
  replace(route: string): void {
    navigationRef.dispatch(StackActions.replace(route));
  }
  navigate(route: string): void {
    navigationRef.navigate(route);
  }
  goBack(): void {
    navigationRef.goBack();
  }
}
