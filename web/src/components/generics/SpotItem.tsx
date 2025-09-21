import React from 'react';
import styled from 'styled-components';
import { MdPlayCircleFilled, MdDelete } from 'react-icons/md';
import { Spot } from '../../core/domain/spots/Spot';

interface Props {
  item: Spot;
  onSpotPressed: (item: Spot) => void;
  onDeletePressed?: (item: Spot) => void;
  shouldShowAdminOptions?: boolean;
  style?: React.CSSProperties;
  nameStyle?: React.CSSProperties;
}

const SpotItem: React.FC<Props> = props => {
  const {
    item,
    onSpotPressed,
    style,
    nameStyle,
    onDeletePressed,
    shouldShowAdminOptions,
  } = props;
  const handleSelectSpot = () => {
    if (typeof onSpotPressed === 'function') onSpotPressed(item);
  };

  const { coverPicture, name, isOnline } = item;

  return (
    <ItemContainer onClick={handleSelectSpot} style={style}>
      <ImageContainer $url={coverPicture}>
        <OpacityContainer>
          {isOnline ? (
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
            <MdPlayCircleFilled size={50} color="#FFF" />
          </PlayContainer>
          <SpotName className="truncate" style={nameStyle}>
            {name}
          </SpotName>
        </OpacityContainer>
      </ImageContainer>
      {shouldShowAdminOptions ? (
        <DeleteIcon className="opacity" onClick={() => onDeletePressed?.(item)}>
          <MdDelete color="#FFF" size={15} />
        </DeleteIcon>
      ) : null}
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  min-width: 200px;
  min-height: 160px;
  width: calc(14.27% - 3px);
  background-color: #0d1419;
  margin: 5px;
  cursor: pointer;

  @media (max-width: 630px) {
    min-width: 140px;
    min-height: 100px;
    margin: 2.5px;
    width: calc(50% - 5px);
  }
`;

interface ImageContainerProps {
  $url: string;
}

const ImageContainer = styled.div<ImageContainerProps>`
  min-width: 100%;
  height: 100%;
  background-color: #0d1419a0;
  background-image: ${props => `url(${props.$url})`};
  background-size: cover;
  background-position: center;
`;
const OpacityContainer = styled.div`
  min-width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.3);
  display: flex;
  flex-direction: column;
`;

const SpotName = styled.div`
  font-family: Poppins;
  font-size: 16px;
  font-weight: bold;
  font-style: normal;
  font-stretch: normal;
  line-height: 1.5;
  letter-spacing: normal;
  color: #ffffff;
  max-width: 170px;
  padding-right: 10px;
  padding-bottom: 10px;
  padding-left: 10px;
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
  flex-grow: 1;
`;

const DeleteIcon = styled.div`
  margin: 10px;
  float: right;
  width: 25px;
  height: 25px;
  background-color: #ea4335;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
`;

export default SpotItem;
