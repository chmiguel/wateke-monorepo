import React, { useEffect } from 'react';
import styled from 'styled-components';
import { ToastContainer } from 'react-toastify';
import AbsoluteLoader from '../components/generics/AbsoluteLoader';
import { useRouteMatch } from 'react-router-dom';
import { selectedSpotBloc, useBloc, userBloc } from '../core/state';
import SpotInviteBloc from '../presenters/SpotInviteBloc';
import withBloc from '../core/withBlocHOC';
import BlocsFactory from '../BlocsFactory';

const Splash = styled.div`
  min-height: 100vh;
  background-image: url('/assets/images/banner.jpg');
  background-repeat: none;
  background-size: cover;
  filter: blur(0px);
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const SpotCard = styled.div`
  min-height: 400px;
  width: 300px;
  min-width: 300px;
  border-radius: 4px;
  display: flex;
  flex-direction: column;
  background-color: #101010;
`;

const SpotCover = styled.div`
  height: 200px;
  width: 300px;
  background-size: cover;
  position: relative;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

const CoverBack = styled.div`
  position: absolute;
  top: 0px;
  left: 0px;
  right: 0px;
  bottom: 0px;
  background-color: rgba(0, 0, 0, 0.8);
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  padding: 16px;
  border-top-right-radius: 4px;
  border-top-left-radius: 4px;
`;

const SpotName = styled.p`
  font-size: 16px;
  color: white;
`;

const SportDescription = styled.p`
  font-size: 12px;
  color: white;
`;

const Action = styled.div`
  padding: 16px;
  font-size: 14px;
`;

const Content = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 14px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #e0e0e0;
`;

const Spots: React.FC = () => {
  const match = useRouteMatch<{ spotId?: string }>();
  const [state, bloc] = useBloc(SpotInviteBloc);

  useEffect(() => {
    if (match?.params?.spotId) bloc.start(match?.params?.spotId);
  }, []);

  return (
    <Splash>
      {state.spot ? (
        <AbsoluteLoader visible={state.isJoiningToSpot}>
          <SpotCard>
            <SpotCover
              style={{
                backgroundImage: `url('${state.spot.coverPicture}')`,
              }}
            >
              <CoverBack>
                <SpotName>{state.spot.name}</SpotName>
                <SportDescription>{state.spot.description}</SportDescription>
              </CoverBack>
            </SpotCover>
            <Content className="flex-fill">
              <p className="invitation grey-text">
                Has sido invitado a unirte al Spot {state.spot.name}. Escucha
                grupal y democráticamente la música que te gusta con otros
                usuarios en Wateke.
              </p>
            </Content>
            <Divider />
            <div className="actions row-cont space-between">
              <Action className="opacity">
                <p className="bold-text grey-text">CANCELAR</p>
              </Action>
              <Action
                onClick={bloc.joinToSpot}
                role="button"
                tabIndex={0}
                className="opacity"
              >
                <p className="bold-text link">UNIRME</p>
              </Action>
            </div>
          </SpotCard>
        </AbsoluteLoader>
      ) : null}
      <ToastContainer />
    </Splash>
  );
};

export default withBloc(Spots, () =>
  BlocsFactory.spotInviteBloc(userBloc, selectedSpotBloc),
);
