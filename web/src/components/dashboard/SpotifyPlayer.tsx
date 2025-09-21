import React, { Fragment, useEffect, useRef } from 'react';
import { CircularProgress } from '@mui/material';
import { styled as muiStyled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import styled from 'styled-components';
import Button from '../generics/Button';
import { useBloc } from '../../core/state';
import PlayerBloc from '../../presenters/SpotifyPlayerBloc';
import withBloc from '../../core/withBlocHOC';
import BlocsFactory from '../../BlocsFactory';
import { PlayerProps } from '../../core/domain/music/PlayerProps';
import { useLocation, useNavigate } from 'react-router-dom';
import { accentColor } from '../../constants';
import { MdSearch, MdPlayArrow, MdPause } from 'react-icons/md';

declare global {
  interface Window {
    Spotify: any;
    onSpotifyWebPlaybackSDKReady: () => void;
  }
}

export const getSpotifyPlayerBounds = () => {
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

const StyledSlider = muiStyled(Slider)(({ theme }) => ({
  '& .MuiSlider-track': {
    height: 4,
  },
  '& .MuiSlider-rail': {
    backgroundColor: 'grey',
    opacity: 1,
  },
}));

const { width, height } = getSpotifyPlayerBounds();

const SpotifyPlayer: React.FC<PlayerProps> = props => {
  const { songId, song } = props;
  const [state, bloc] = useBloc(PlayerBloc);
  const navigate = useNavigate();
  const isFirstTime = useRef(true);
  const location = useLocation();
  const refreshIntervalRef = useRef<ReturnType<typeof setInterval>>();

  useEffect(() => {
    if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    refreshIntervalRef.current = setInterval(() => {
      bloc.refreshTokenIfNeeded()?.then(accessToken => {
        bloc.emit({ ...bloc.state, accessToken });
      });
    }, 30000);
    return () => {
      if (refreshIntervalRef.current) clearInterval(refreshIntervalRef.current);
    };
  }, [bloc]);

  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      if (params.has('access_token')) {
        const accessToken = params.get('access_token');
        localStorage.setItem('spotify:accessToken', accessToken as string);
        localStorage.setItem(
          'spotify:expiresAt',
          params.get('expires_at') as string,
        );
        localStorage.setItem(
          'spotify:refreshToken',
          params.get('refresh_token') as string,
        );
        bloc.emit({ ...bloc.state, accessToken });
        navigate('/dashboard', { replace: true });
      }
    }
  }, [location.search]);

  useEffect(() => {
    props.onPlayerReady?.();
    bloc.initializePlayer();
    return () => {
      bloc.unmount();
    };
  }, []);

  useEffect(() => {
    bloc.start(props);
  }, [props]);

  useEffect(() => {
    if (state.hasPlayerLoaded && songId) {
      bloc.setCurrentSong(songId);
    }
  }, [state.shouldShowPlayer, state.hasPlayerLoaded, songId]);

  useEffect(() => {
    if (songId && isFirstTime.current) {
      isFirstTime.current = false;
    } else if (songId) {
      setTimeout(() => {
        bloc.togglePlay();
      }, 1000);
    }
  }, [songId]);

  if (props.shouldKeepPlayerHidden) return null;

  return (
    <Fragment>
      {state.accessToken && songId && (
        <>
          <PlayerContainer
            $hasPlayerLoaded={state.hasPlayerLoaded}
            style={{
              width: width,
              height: height,
              backgroundImage:
                song && song.pictureMedium
                  ? `url(${song?.pictureMedium})`
                  : undefined,
            }}
          >
            {state.isLoadingTrack ? (
              <PlayerButton>
                <CircularProgress size={26} />
              </PlayerButton>
            ) : (
              <PlayerButton onClick={bloc.togglePlay}>
                {state.isPlaying ? (
                  <MdPause size={26} />
                ) : (
                  <MdPlayArrow size={26} />
                )}
              </PlayerButton>
            )}
          </PlayerContainer>
          <StyledSlider
            value={state.currentTrackProgressPercentage}
            onChange={(e, value) => bloc.updateProgress(Array.isArray(value) ? value[0] : value)}
            onDragEnd={() => bloc.seekToProgress()}
            style={{
              width: width,
            }}
          />
          <SongInfo
            style={{
              width: width - 32,
            }}
          >
            <h3>{song?.title}</h3>
            <p>
              {song?.artistName} - {song?.albumTitle}
            </p>
          </SongInfo>
        </>
      )}
      {state.accessToken && !songId && (
        <FakePlayer $width={width} $height={height}>
          <Title>
            Ya tienes todo listo, agrega tu primera canción a tu playlist a
            traves de la barra de búsqueda
          </Title>
          <MdSearch color={accentColor} size={40} />
        </FakePlayer>
      )}

      {!state.accessToken ? (
        <FakePlayer $width={width} $height={height}>
          <Title>Para reproducir debes iniciar sesión con Spotify</Title>
          {state.isLoggingIn ? (
            <CircularProgress size={25} color="primary" />
          ) : (
            <a href={`${process.env.REACT_APP_API_URL}/auth/login`}>
              <Button>
                <ButtonText>Iniciar sesión con Spotify</ButtonText>
              </Button>
            </a>
          )}
        </FakePlayer>
      ) : null}
    </Fragment>
  );
};

interface PlayerContainerProps {
  $hasPlayerLoaded: boolean;
}

const PlayerContainer = styled.div<PlayerContainerProps>`
  display: ${props => (props.$hasPlayerLoaded ? 'flex' : 'none')};
  flex-direction: column-reverse;
  background-size: cover;
  background-repeat: no-repeat;
  position: relative;
  align-self: center;
  iframe:last-child {
    height: 100%;
    display: ${props => (props.$hasPlayerLoaded ? 'block' : 'none')}!important;
  }
  iframe {
    display: none !important;
  }
`;

interface FakePlayerProps {
  $width: number;
  $height: number;
}

const FakePlayer = styled.div<FakePlayerProps>`
  background-color: #00000060;
  width: ${props => props.$width - 40}px;
  height: ${props => props.$height - 40}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
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

const PlayerButton = styled.button`
  width: 70px;
  height: 70px;
  position: absolute;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
  border: none;
  left: calc(50% - 35px);
  top: calc(50% - 35px);
  border-radius: 35px;
  outline: none;
  box-shadow: 2px 2px 5px #00000080;
`;

const SongInfo = styled.div`
  background-color: #fff;
  padding: 10px 16px;
  height: 50px;
  h3 {
    margin-top: 0px;
    margin-bottom: 0px;
    font-size: 16px;
  }
  p {
    margin-bottom: 0px;
    font-size: 14px;
  }
`;

export default withBloc(SpotifyPlayer, () => BlocsFactory.spotifyPlayerBloc());
