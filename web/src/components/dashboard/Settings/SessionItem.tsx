import React from 'react';
import styled from 'styled-components';
import { MdComputer, MdPhoneAndroid, MdPhoneIphone } from 'react-icons/md';

interface Props {
    isSessionPlayer: boolean;
    onChangeToPlayerPressed: ()=>void;
    sessionOperatingSystem: string;
}

const SessionItem: React.FC<Props> = props => {
  const { IconComponent, osName } = getSoInfo(props.sessionOperatingSystem);
  return (
    <SessionContainer className="row-cont">
      <IconComponent size={26} color="#fff" />
      <div style={{ marginLeft: 10 }} className="flex-fill">
        <div className="row-cont space-between">
          <SessionTitle className="bold-text">{osName}</SessionTitle>
          {props.isSessionPlayer? (
            <SessionTitle style={{ marginBottom: 5 }} className="bold-text">
              Reproductor
            </SessionTitle>
          ) : (
            <SessionLink
              onClick={props.onChangeToPlayerPressed}
              className="opacity link"
            >
              Cambiar a reproductor
            </SessionLink>
          )}
        </div>
        <SessionDesc className="grey-text">{props.sessionOperatingSystem}</SessionDesc>
      </div>
    </SessionContainer>
  );
};

const getSoInfo = (operatingSystem: string) => {
    if(!operatingSystem) return { IconComponent: MdComputer, osName: 'Computer' };
    const osLowCase = operatingSystem.toLowerCase();
    if (osLowCase.indexOf('windows') !== -1) {
      return { IconComponent: MdComputer, osName: 'Windows' };
    }
    if (osLowCase.indexOf('android') !== -1) {
      return { IconComponent: MdPhoneAndroid, osName: 'Android' };
    }
    if (osLowCase.indexOf('iphone') !== -1) {
      return { IconComponent: MdPhoneIphone, osName: 'Iphone' };
    }
    if (osLowCase.indexOf('mac') !== -1) {
      return { IconComponent: MdComputer, osName: 'Mac OS' };
    }
    if (osLowCase.indexOf('linux') !== -1) {
      return { IconComponent: MdComputer, osName: 'Linux' };
    }
    return { IconComponent: MdComputer, osName: 'Computer' };
};

const SessionContainer = styled.div`
  max-width: 298px !important;
  min-width: 298px !important;
  width: 298px !important;
  padding: 10px;
  box-shadow: 0px 1px 5px black;
  margin-top: 0px;
  margin-bottom: 20px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 4px;
`;

const SessionTitle = styled.p`
  font-size: 12px;
  color: #606060;
  margin-bottom: 5px;
  color: #fff;
`;

const SessionDesc = styled.p`
  font-size: 10px;
  color: #d0d0d0;
`;

const SessionLink = styled.p`
  font-size: 10px;
  margin-bottom: 5px;
`;

export default SessionItem;