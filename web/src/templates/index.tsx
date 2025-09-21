import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

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
import { useNavigationService } from '../hooks/useNavigationService';
// import history from '../history'; // Not needed in React Router v6

const Loading = (
  <div className="total-center loading-container">
    <img
      src="/assets/images/logo-white.svg"
      alt="wateke"
      className="loading-icon"
    />
  </div>
);

// Component to initialize navigation service inside router context
const NavigationServiceProvider: React.FC = () => {
  useNavigationService();
  return null;
};

// Private Route wrapper for authenticated users
interface PrivateRouteProps {
  children: React.ReactElement;
  requiresSpotSelection?: boolean;
  isAuthenticated: boolean;
  hasSpotSelected: boolean;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ 
  children, 
  requiresSpotSelection = true,
  isAuthenticated,
  hasSpotSelected
}) => {
  // If not authenticated, redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // If authenticated but no spot selected and spot is required
  if (requiresSpotSelection && !hasSpotSelected) {
    return <Navigate to="/select-spot" replace />;
  }

  // If authenticated and spot selected (or spot not required), render the component
  return children;
};

// Unlogged Route wrapper for public pages
interface UnloggedRouteProps {
  children: React.ReactElement;
  isAuthenticated: boolean;
  hasSpotSelected: boolean;
}

const UnloggedRoute: React.FC<UnloggedRouteProps> = ({ 
  children, 
  isAuthenticated, 
  hasSpotSelected 
}) => {
  // If authenticated and has spot selected, redirect to dashboard
  if (isAuthenticated && hasSpotSelected) {
    return <Navigate to="/dashboard" replace />;
  }

  // If authenticated but no spot selected, redirect to spot selection
  if (isAuthenticated && !hasSpotSelected) {
    return <Navigate to="/select-spot" replace />;
  }

  // If not authenticated, render the public component
  return children;
};

const AppRoutes: React.FC = () => {
  const [userState] = useBloc(UserBloc);
  const [selectedSpotState] = useBloc(SelectedSpotBloc);

  if (!userState.isInitialized) {
    return null;
  }

  const isAuthenticated = !!userState.uid;
  const hasSpotSelected = !!selectedSpotState.spot;
  
  return (
    <Suspense fallback={Loading}>
      <BrowserRouter>
        <NavigationServiceProvider />
        <Routes>
          {/* Public routes - redirect authenticated users appropriately */}
          <Route 
            path="/login" 
            element={
              <UnloggedRoute isAuthenticated={isAuthenticated} hasSpotSelected={hasSpotSelected}>
                <Login />
              </UnloggedRoute>
            } 
          />
          <Route 
            path="/" 
            element={
              <UnloggedRoute isAuthenticated={isAuthenticated} hasSpotSelected={hasSpotSelected}>
                <Login />
              </UnloggedRoute>
            } 
          />
          <Route 
            path="/landing" 
            element={
              <UnloggedRoute isAuthenticated={isAuthenticated} hasSpotSelected={hasSpotSelected}>
                <LandingPage />
              </UnloggedRoute>
            } 
          />
          
          {/* Public routes without authentication redirects */}
          <Route path="/spots/:spotId" element={<Spots />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          
          {/* Private routes - require authentication and spot selection */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} hasSpotSelected={hasSpotSelected}>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Private route that doesn't require spot selection */}
          <Route 
            path="/select-spot" 
            element={
              <PrivateRoute 
                requiresSpotSelection={false} 
                isAuthenticated={isAuthenticated} 
                hasSpotSelected={hasSpotSelected}
              >
                <SpotsList />
              </PrivateRoute>
            } 
          />
          
          {/* Private route that requires spot selection */}
          <Route 
            path="/my-spots" 
            element={
              <PrivateRoute isAuthenticated={isAuthenticated} hasSpotSelected={hasSpotSelected}>
                <MySpots />
              </PrivateRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </Suspense>
  );
};

export default AppRoutes;
