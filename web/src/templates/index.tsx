import React, { ComponentType, Suspense } from 'react';
import { Router, Route, Redirect, RouteProps } from 'react-router-dom';

const SpotsList = React.lazy(() => import('./SpotsList'));
const Dashboard = React.lazy(() => import('./Dashboard'));
const MySpots = React.lazy(() => import('./MySpots'));
const Login = React.lazy(() => import('./Login'));
const Spots = React.lazy(() => import('./Spots'));
const PrivacyPolicy = React.lazy(() => import('./PrivacyPolicy'));
const LandingPage = React.lazy(() => import('./LandingPage'));

import { useBloc } from '../core/state';
import UserBloc from '../core/blocs/UserBloc';
import SelectedSpotBloc from '../core/blocs/SelectedSpotBloc';
import history from '../history';

const Loading = (
  <div className="total-center loading-container">
    <img
      src="/assets/images/logo-white.svg"
      alt="wateke"
      className="loading-icon"
    />
  </div>
);

const Routes: React.FC = () => {
  const [userState] = useBloc(UserBloc);
  const [selectedSpotState] = useBloc(SelectedSpotBloc);
  return (
    <Suspense fallback={Loading}>
      <Router history={history}>
        <div>
          <UnloggedRoute
            hasSpotSelected={!!selectedSpotState.spot}
            isAuthenticated={!!userState.uid}
            exact
            path="/login"
            component={Login}
          />
          <UnloggedRoute
            hasSpotSelected={!!selectedSpotState.spot}
            isAuthenticated={!!userState.uid}
            exact
            path="/"
            component={Login}
          />
          <UnloggedRoute
            hasSpotSelected={!!selectedSpotState.spot}
            isAuthenticated={!!userState.uid}
            exact
            path="/landing"
            component={LandingPage}
          />
          <Route exact path="/spots/:spotId" component={Spots} />
          <Route exact path="/privacy-policy" component={PrivacyPolicy} />
          <PrivateRoute
            hasSpotSelected={!!selectedSpotState.spot}
            isAuthenticated={!!userState.uid}
            exact
            path="/dashboard"
            component={Dashboard}
          />

          <PrivateRoute
            hasSpotSelected={!!selectedSpotState.spot}
            isAuthenticated={!!userState.uid}
            exact
            path="/select-spot"
            component={SpotsList}
          />
          <PrivateRoute
            hasSpotSelected
            isAuthenticated={!!userState.uid}
            exact
            path="/my-spots"
            component={MySpots}
          />
        </div>
      </Router>
    </Suspense>
  );
};

export default Routes;

const PrivateRoute: React.FC<
  {
    component: React.FC | ComponentType;
    isAuthenticated: boolean;
    hasSpotSelected: boolean;
  } & RouteProps
> = ({ component: Component, isAuthenticated, hasSpotSelected, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthenticated) {
        if (hasSpotSelected) {
          return <Component {...props} />;
        }
        if (rest.path !== '/select-spot') {
          return <Redirect exact to="/select-spot" />;
        }
        return <Component {...props} />;
      }
      return <Redirect exact to="/login" />;
    }}
  />
);

const UnloggedRoute: React.FC<
  {
    component: React.FC | ComponentType;
    isAuthenticated: boolean;
    hasSpotSelected: boolean;
  } & RouteProps
> = ({ component: Component, isAuthenticated, hasSpotSelected, ...rest }) => (
  <Route
    {...rest}
    render={props => {
      if (isAuthenticated) {
        if (hasSpotSelected && rest.path !== '/dashboard') {
          return <Redirect to="/dashboard" {...props} />;
        }
        if (rest.path !== '/select-spot') {
          return <Redirect exact to="/select-spot" />;
        }
        return <Component {...props} />;
      }
      return <Component {...props} />;
    }}
  />
);
