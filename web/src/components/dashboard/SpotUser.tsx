import React, { ReactElement } from 'react';
import styled from 'styled-components';
import Switch from '@mui/material/Switch';
import { SpotUserVM } from '../../core/domain/auth/User';

interface Props {
  user: SpotUserVM;
  isAdmin?: boolean;
  toggleBlockedStatus: (user: SpotUserVM) => void;
}

const SpotUser: React.FC<Props> = ({
  user,
  isAdmin,
  toggleBlockedStatus,
}): ReactElement => {
  return (
    <UserContainer>
      <UserInfoContainer>
        <Avatar src={user.avatar} />
        <Name>{user.name}</Name>
      </UserInfoContainer>

      <UserActionContainer>
        {isAdmin ? (
          <Switch
            checked={Boolean(user.isBlocked)}
            value="checked"
            onChange={() => {
              toggleBlockedStatus(user);
            }}
            color="primary"
            classes={{ root: 'create-spot-switch' }}
          />
        ) : null}
      </UserActionContainer>
    </UserContainer>
  );
};

const UserContainer = styled.div`
  display: flex;
  width: 100%;
  padding: 5px;
`;

const UserInfoContainer = styled.div`
  flex: 8;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const UserActionContainer = styled.div`
  flex: 2;
  display: flex;
  align-items: center;
  justify-content: center;
`;

const Name = styled.div`
  font-size: 13px;
  font-weight: 600;
  font-style: normal;
  font-stretch: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #ffffff;
  margin-left: 10px;
`;

interface AvatarProps {
  src: string | null;
}

const Avatar = styled.div<AvatarProps>`
  width: 30px !important;
  max-width: 30px;
  height: 30px;
  border-radius: 30px;
  background-image: ${props => `url(${props.src})`};
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center;
`;

export default SpotUser;
