import React, { useCallback } from 'react';
import styled from 'styled-components';
import { Switch, Select, MenuItem } from '@material-ui/core';
import { UserConfig, UserConfigValue } from '../../../core/domain/spots/Spot';

interface Props {
  config: UserConfig;
  currentValue: UserConfigValue;
  onChangeValue: (value: UserConfigValue, config: UserConfig) => void;
}

const ConfigItem: React.FC<Props> = ({
  config,
  currentValue,
  onChangeValue,
}) => {
  const { title, subtitle, type, options } = config;

  const onChangeConfig = useCallback(
    ({
      target: { value },
    }: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      if (!onChangeValue) return;
      if (type === 'switch')
        onChangeValue(
          typeof currentValue === 'boolean' ? !currentValue : false,
          config,
        );
      else onChangeValue(value, config);
    },
    [type, currentValue],
  );

  return (
    <ConfigContainer className="row-cont">
      {type === 'switch' ? (
        <>
          <div className="flex-fill">
            <ConfigTitle className=" bold-text">{title}</ConfigTitle>
            <ConfigDesc className="grey-text">{subtitle}</ConfigDesc>
          </div>
          <Switch
            checked={currentValue ? 'checked' : ''}
            value="checked"
            onChange={onChangeConfig}
          />
        </>
      ) : null}
      {type === 'select' ? (
        <div>
          <ConfigTitle className=" bold-text">{title}</ConfigTitle>
          <ConfigDesc className="grey-text">{subtitle}</ConfigDesc>
          <Select
            value={currentValue !== undefined ? currentValue : ''}
            onChange={onChangeConfig}
          >
            {Array.isArray(options)
              ? options.map(opt => (
                  <MenuItem value={opt.value} key={opt.value}>
                    {opt.label}
                  </MenuItem>
                ))
              : null}
          </Select>
        </div>
      ) : null}
    </ConfigContainer>
  );
};

const ConfigContainer = styled.div`
  max-width: 298px !important;
  min-width: 298px !important;
  width: 298px !important;
  padding: 10px;
  box-shadow: 0px 1px 5px black;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 10px;
  margin-left: 10px;
  border-radius: 4px;
`;

const ConfigTitle = styled.p`
  font-size: 12px;
  color: #606060;
  margin-bottom: 5px;
  color: #fff;
`;

const ConfigDesc = styled.p`
  font-size: 10px;
  color: #d0d0d0;
`;

export default ConfigItem;
