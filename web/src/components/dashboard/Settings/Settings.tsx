import React, { useEffect } from 'react';
import styled from 'styled-components';
import withBloc from '../../../core/withBlocHOC';
import SettingsBloc from '../../../presenters/SettingsBloc';
import { useBloc } from '../../../core/state';
import ConfigItem from './ConfigItem';
import BlocsFactory from '../../../BlocsFactory';
import { UserConfigValue } from '../../../core/domain/spots/Spot';
import SelectedSpotBloc from '../../../core/blocs/SelectedSpotBloc';

const ContainerSettings = styled.div`
  padding-top: 20px;
  padding-bottom: 20px;
`;

const SectionTitle = styled.p`
  color: #fff;
  margin: 20px;
  font-size: 14px;
`;

const Settings: React.FC = () => {
  const [state, bloc] = useBloc(SettingsBloc);
  const [_, selectedSpotBloc] = useBloc(SelectedSpotBloc);

  useEffect(() => {
    bloc.start(!!selectedSpotBloc.isCurrentUserAdmin());
    return bloc.unmount;
  }, []);

  return (
    <ContainerSettings>
      <SectionTitle>Configuración del Spot</SectionTitle>
      {state.availableSettings.map((item, i) => {
        return (
          <ConfigItem
            currentValue={state.spotConfig[item.id] as UserConfigValue}
            onChangeValue={bloc.updateConfig}
            config={item}
            key={i}
          />
        );
      })}
    </ContainerSettings>
  );
};

export default withBloc(Settings, BlocsFactory.settingsBloc());
