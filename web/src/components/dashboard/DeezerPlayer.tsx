import React, { Fragment, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import styled from 'styled-components';
import Button from '../generics/Button';
import DeezerSDKLoader, { Counter } from './DeezerSDKLoader';
import { useBloc } from '../../core/state';
import PlayerBloc from '../../presenters/DeezerPlayerBloc';
import withBloc from '../../core/withBlocHOC';
import BlocsFactory from '../../BlocsFactory';
import { PlayerProps } from '../../core/domain/music/PlayerProps';
import { MdSearch } from 'react-icons/md';
import { accentColor } from '../../constants';

export const getDeezerPlayerBounds = () => {
  let width = 435;
  let height = 435;
  const format = 'square';
  if (window.innerWidth < 1200 && window.innerWidth > 992) {
    width = 435;
    height = 435;
  } else if (window.innerWidth < 992 && window.innerWidth > 490) {
    width = 435;
    height = 435;
  } else if (window.innerWidth < 490) {
    width = window.innerWidth - 32;
    height = window.innerWidth - 32;
  }
  return { width, height, format };
};

const { width, height } = getDeezerPlayerBounds();

const DeezerPlayer: React.FC<PlayerProps> = props => {
  const { songId } = props;

  const [state, bloc] = useBloc(PlayerBloc);
  const initialPlayerProps = useRef(props);

  useEffect(() => {
    bloc.loadPlayerSDK(initialPlayerProps.current);
    return () => {
      bloc.unmount();
    };
  }, []);

  useEffect(() => {
    bloc.start(props);
  }, [props]);

  useEffect(() => {
    if (state.shouldShowPlayer && state.hasPlayerLoaded && songId) {
      bloc.setCurrentSong(songId);
    }
  }, [state.shouldShowPlayer, state.hasPlayerLoaded, songId]);

  if (props.shouldKeepPlayerHidden) return null;

  if (!state.shouldShowPlayer) return <DeezerSDKLoader />;
  return (
    <Fragment>
      <PlayerContainer
        hasPlayerLoaded={state.hasPlayerLoaded}
        id="my-player"
        style={
          bloc.isAuthenticatedWithMusicProvider()
            ? {
                minWidth: width,
                height: height,
                overflow: 'hidden',
                flexDirection: 'column-reverse',
                display: songId && state.hasPlayerLoaded ? 'block' : 'none',
              }
            : undefined
        }
      ></PlayerContainer>
      {!state.hasPlayerLoaded && bloc.isAuthenticatedWithMusicProvider() ? (
        <PlayerLoader width={width} height={height}>
          <p className="white-text">
            {state.hasPlayerLoadFailed
              ? 'Error al cargar reproductor.'
              : 'Cargando reproductor.'}
          </p>

          <Counter timeToIntentInSecs={state.timeToTryLoadAgain} />
        </PlayerLoader>
      ) : null}

      {bloc.isAuthenticatedWithMusicProvider() &&
        !songId &&
        state.hasPlayerLoaded && (
          <FakePlayer width={width} height={height}>
            <Title>
              Ya tienes todo listo, agrega tu primera canción a tu playlist a
              traves de la barra de búsqueda
            </Title>
            <MdSearch color={accentColor} size={40} />
          </FakePlayer>
        )}

      {!bloc.isAuthenticatedWithMusicProvider() ? (
        <FakePlayer width={width} height={height}>
          <Title>Para reproducir debes iniciar sesión de Deezer</Title>
          {state.isLoggingIn ? (
            <CircularProgress size={25} color="primary" />
          ) : (
            <Button onClick={bloc.authenticateWithMusicProvider}>
              <ButtonText>Log In</ButtonText>
            </Button>
          )}
        </FakePlayer>
      ) : null}
    </Fragment>
  );
};

interface PlayerContainerProps {
  hasPlayerLoaded: boolean;
}

const PlayerContainer = styled.div<PlayerContainerProps>`
  display: ${props => (props.hasPlayerLoaded ? 'flex' : 'none')};
  iframe:last-child {
    height: 100%;
    display: ${props => (props.hasPlayerLoaded ? 'block' : 'none')}!important;
  }
  iframe {
    display: none !important;
  }
`;

interface FakePlayerProps {
  width: number;
  height: number;
}

const FakePlayer = styled.div<FakePlayerProps>`
  background-color: #00000060;
  width: ${props => props.width - 40}px;
  height: ${props => props.height - 40}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

interface PlayerLoaderProps {
  width: number;
  height: number;
}

const PlayerLoader = styled.div<PlayerLoaderProps>`
  background-color: #00000060;
  width: ${props => props.width - 40}px;
  height: ${props => props.height - 40}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
  text-align: center;
`;

const Title = styled.p`
  color: #fff;
  text-align: center;
  margin-bottom: 20px;
`;

const ButtonText = styled.p`
  font-weight: bold;
  font-size: 14px;
  text-align: center;
`;

export default withBloc(DeezerPlayer, () => BlocsFactory.deezerPlayerBloc());
