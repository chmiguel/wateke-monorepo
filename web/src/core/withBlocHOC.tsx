import React from 'react';
import { Cubit } from 'bloc-react';
import { BlocProvider } from './state';

function withBloc<P, T extends Cubit<any>>(
  WrappedComponent: React.FC<P>,
  bloc: T | (() => T),
) {
  return function WithBlocComponent(props: P) {
    return (
      <BlocProvider<T> bloc={bloc}>
        <WrappedComponent {...props} />
      </BlocProvider>
    );
  };
}

export default withBloc;
