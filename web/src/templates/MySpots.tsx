import React, { useEffect } from 'react';
import styled from 'styled-components';
import SpotItem from '../components/generics/SpotItem';
import MainLayout from '../components/layouts/MainLayout';
import ActionModal from '../components/generics/ActionModal';
import { selectedSpotBloc, useBloc } from '../core/state';
import MySpotsBloc from '../presenters/MySpotsBloc';
import withBloc from '../core/withBlocHOC';
import BlocsFactory from '../BlocsFactory';
import UserBloc from '../core/blocs/UserBloc';

const SpotsGrid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(380px, 1fr));
  justify-items: center;
  @media (max-width: 910px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
  @media (max-width: 630px) {
    grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  }
`;

const GreenText = styled.div`
  font-weight: bold;
  color: #00fece;
  font-size: 20px;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  margin-left: 50px;
`;

const Container = styled.div`
  padding: 20px;
  display: flex;
  flex-direction: column;
  background-image: url(/assets/images/fondo1.jpg);
  min-height: 100vh;
  background-repeat: no-repeat;
  background-attachment: fixed;
  padding-top: 70px;
`;
const MySpots: React.FC = () => {
  const [state, bloc] = useBloc(MySpotsBloc);
  const [userState] = useBloc(UserBloc, { subscribe: false });

  useEffect(() => {
    bloc.start(userState.uid!);
  }, []);

  return (
    <MainLayout>
      <ActionModal
        open={state.actionModal.isOpen}
        title={state.actionModal.title}
        description={state.actionModal.description}
        acceptAction={state.actionModal.onAccept}
        cancelAction={bloc.closeActionModal}
      />
      <Container>
        {state.userSpots.length ? (
          <div>
            <GreenText>Mis Spots</GreenText>
            <SpotsGrid>
              {state.userSpots.map((item, i) => {
                return (
                  <SpotItem
                    onSpotPressed={bloc.selectSpot}
                    key={'sp_' + i}
                    item={item}
                    shouldShowAdminOptions
                    onDeletePressed={bloc.handleDeleteSpotPressed}
                  />
                );
              })}
            </SpotsGrid>
          </div>
        ) : null}
      </Container>
    </MainLayout>
  );
};

export default withBloc(MySpots, () =>
  BlocsFactory.mySpotsBloc(selectedSpotBloc),
);
