import React from 'react';
import styled from 'styled-components';
import { MdPlayCircleFilled, MdMusicNote } from 'react-icons/md';
import { Spot } from '../../core/domain/spots/Spot';

interface Props {
  spots: Spot[];
  onPressSpot: (spot: Spot) => void;
}

const SpotResults: React.FC<Props> = props => {
  return (
    <SpotsGrid>
      {props.spots.map((spot, key) => {
        return (
          <ItemContainer
            key={key}
            src={spot.coverPicture}
            onClick={() => props.onPressSpot(spot)}
          >
            <Opacity>
              {spot.adminConnections ? (
                <StatusContainer>
                  <Online />
                  <span style={{ marginLeft: '5px' }}>Online</span>
                </StatusContainer>
              ) : (
                <StatusContainer>
                  <Offline />
                  <span style={{ marginLeft: '5px' }}>Offline</span>
                </StatusContainer>
              )}
              <PlayContainer>
                <MdPlayCircleFilled size={70} color="#FFF" />
              </PlayContainer>
              <NameContainer>
                <Name className="truncate">{spot.name}</Name>
                <Music className="truncate">
                  <MdMusicNote /> Música: Variada
                </Music>
              </NameContainer>
            </Opacity>
          </ItemContainer>
        );
      })}
    </SpotsGrid>
  );
};

const SpotsGrid = styled.div`
  margin-top: 10px;
  display: grid;
  grid-gap: 10px;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  justify-items: center;
  @media (max-width: 400px) {
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  }
`;

const ItemContainer = styled.div`
  width: 300px;
  height: 230px;
  background-image: ${props => `url(${props.src})`};
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  cursor: pointer;
  @media (max-width: 400px) {
    width: 250px;
  }
`;
const Opacity = styled.div`
  width: 300px;
  height: 230px;
  background-color: rgba(0, 0, 0, 0.5);
  @media (max-width: 400px) {
    width: 250px;
  }
`;

const Online = styled.div`
  width: 10px;
  height: 10px;
  background-color: #06fe37;
  border-radius: 10px;
`;
const Offline = styled.div`
  width: 10px;
  height: 10px;
  background-color: #979ca8;
  border-radius: 10px;
`;

const StatusContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  color: #fff;
  font-size: 10px;
  padding: 10px;
`;

const PlayContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 130px;
`;

const NameContainer = styled.div``;

const Name = styled.div`
  font-size: 19px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.53;
  letter-spacing: normal;
  text-align: left;
  color: #00fece;
  margin-left: 10px;
`;
const Music = styled.div`
  font-size: 12px;
  font-weight: 400;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.6;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  margin-left: 10px;
`;

export default SpotResults;
