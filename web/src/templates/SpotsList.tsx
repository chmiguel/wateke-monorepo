import React, { useEffect } from 'react';
import { ToastContainer } from 'react-toastify';
import styled from 'styled-components';
import MainLayout from '../components/layouts/MainLayout';
import SpotItem from '../components/generics/SpotItem';
import SpotResults from '../components/generics/SpotResults';
import BlocsFactory from '../BlocsFactory';
import withBloc from '../core/withBlocHOC';
import SpotsListBloc from '../presenters/SpotsListBloc';
import { selectedSpotBloc, useBloc } from '../core/state';
import { CircularProgress } from '@material-ui/core';

const SpotsList: React.FC = () => {
  const [state, bloc] = useBloc(SpotsListBloc);

  useEffect(() => {
    bloc.start();
  }, []);

  return (
    <MainLayout
      title="Búsqueda de Spots"
      onSearchRequested={bloc.search}
      onSearchTextChanged={bloc.handleSearchTextChanged}
    >
      <Container>
        {!state.isSearchViewActive ? (
          <div>
            <GreenText>Spots populares</GreenText>
            <SpotList>
              {state.popularSpots.map((item, i) => (
                <SpotItem
                  key={`'p${i}`}
                  onSpotPressed={bloc.selectSpot}
                  item={item}
                />
              ))}
            </SpotList>
            {state.userSpots.length ? (
              <div>
                <GreenText>Mis spots</GreenText>
                <SpotList>
                  {state.userSpots.map((item, i) => (
                    <SpotItem
                      key={`'p${i}`}
                      onSpotPressed={bloc.selectSpot}
                      item={item}
                    />
                  ))}
                </SpotList>
              </div>
            ) : null}
          </div>
        ) : (
          <div>
            <GreenText style={{ marginBottom: 0 }}>
              <ButtonHover
                style={{ maxWidth: 65 }}
                onClick={bloc.closeSearchView}
              >
                Volver
              </ButtonHover>
            </GreenText>
            {state.isSearchingSpots ? (
              <div className="total-center">
                <CircularProgress />
              </div>
            ) : (
              <>
                {state.foundSpots.length > 0 ? (
                  <div style={{ marginLeft: 10 }}>
                    <GreenText>
                      <span style={{ color: '#FFF' }}>
                        Mostrando resultados para:{' '}
                      </span>
                      {bloc.searchText}
                    </GreenText>
                  </div>
                ) : (
                  <div style={{ marginLeft: 10 }}>
                    <GreenText>
                      <span style={{ color: '#FFF' }}>
                        No hay resultados para:{' '}
                      </span>
                      {bloc.searchText}
                    </GreenText>
                  </div>
                )}
              </>
            )}
            <br />
            <div style={{ padding: '40px' }}>
              {state.foundSpots.length > 0 ? (
                <SpotResults
                  spots={state.foundSpots}
                  onPressSpot={bloc.selectSpot}
                />
              ) : null}
            </div>
          </div>
        )}

        <br />
        <br />
      </Container>
      <ToastContainer />
    </MainLayout>
  );
};

const GreenText = styled.div`
  font-weight: 400;
  color: #00fece;
  font-size: 20px;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  margin-top: 30px;
  margin-bottom: 10px;
  margin-left: 10px;
`;
const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-image: ${props => props.url};
  min-height: 100vh;
  background-repeat: no-repeat;
  background-size: cover;
  background-attachment: fixed;
  padding-top: 50px;
  @media (max-width: 420px) {
    padding: 5px;
    padding-top: 20px;
  }
`;

const ButtonHover = styled.div`
  padding: 10px;
  cursor: pointer;
  border-radius: 3px;
  :hover {
    background-color: rgba(255, 255, 255, 0.3);
  }
`;

const SpotList = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export default withBloc(SpotsList, () =>
  BlocsFactory.spotsListBloc(selectedSpotBloc),
);
