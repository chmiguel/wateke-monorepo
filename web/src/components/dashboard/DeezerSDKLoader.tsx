import React, { useRef, useState } from 'react';
import styled from 'styled-components';
import { useEffect } from 'react';
import { useBloc } from '../../core/state';
import DeezerPlayerBloc from '../../presenters/DeezerPlayerBloc';
import { getDeezerPlayerBounds } from './DeezerPlayer';

interface FakePlayerProps {
  width: number;
  height: number;
}

const FakePlayer = styled.div<FakePlayerProps>`
  background-color: #00000020;
  width: ${props => props.width - 40}px;
  height: ${props => props.height - 40}px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Counter: React.FC<{ timeToIntentInSecs: number }> = ({
  timeToIntentInSecs,
}) => {
  const [time, setTime] = useState(0);
  const timeout = useRef<ReturnType<typeof setTimeout>>();

  const updater = (intent?: number) => {
    const newTime = timeToIntentInSecs - (intent !== undefined ? intent : 1);
    setTime(newTime);
    timeout.current = setTimeout(
      () => updater(intent !== undefined ? intent + 1 : 1),
      1000,
    );
  };

  useEffect(() => {
    if (timeToIntentInSecs) {
      if (timeout.current) clearTimeout(timeout.current);
      updater();
    }
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, [timeToIntentInSecs]);
  return time && time > 0 ? (
    <p className="white-text">Reintentando en: {time} segundos</p>
  ) : null;
};

const DeezerSDKLoader: React.FC = () => {
  const { width, height } = getDeezerPlayerBounds();
  const [playerState] = useBloc(DeezerPlayerBloc);
  return (
    <FakePlayer width={width} height={height}>
      <p className="white-text">
        Cargando Deezer SDK: {playerState?.playerSDKLoadProgress?.toFixed(0)}%
      </p>
      <Counter timeToIntentInSecs={playerState.timeToTryLoadAgain} />
    </FakePlayer>
  );
};

export { Counter };

export default DeezerSDKLoader;
