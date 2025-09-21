import { Menu } from '@mui/material';
import React, { useCallback, useState } from 'react';
import styled from 'styled-components';
import QrCode from 'qrcode.react';
// import { CopyToClipboard } from 'react-copy-to-clipboard';
import { MdMoreVert } from 'react-icons/md';

interface Props {
  spotName: string;
  spotLink: string;
}

const SpotInfoMenu: React.FC<Props> = ({ spotLink, spotName }) => {
  const [anchorElement, setAnchorElement] = useState<SVGElement | null>(null);
  const [isLinkCopied, setIsLinkCopied] = useState(false);

  const handleMenuPressed = useCallback(
    (event: React.MouseEvent<SVGElement>) => {
      setAnchorElement(event.currentTarget);
    },
    [],
  );

  const handleCloseMenu = useCallback(() => {
    setAnchorElement(null);
    setIsLinkCopied(false);
  }, []);

  return (
    <>
      <MdMoreVert
        size={25}
        color="#FFF"
        className="opacity"
        style={{ marginRight: '10px' }}
        onClick={handleMenuPressed}
      />
      <Menu
        id="simple-menu"
        anchorEl={anchorElement as HTMLElement | null}
        open={Boolean(anchorElement)}
        onClose={handleCloseMenu}
      >
        <MenuContainer>
          <SpotName className="truncate">{spotName}</SpotName>
          <QrContainer>
            <QrCode value={spotLink} size={160} />
          </QrContainer>
          <QrDescription>
            Copia este enlace y compártelo con las personas que quieras que se
            unan a tu spot ó pídeles que escaneen el código QR
          </QrDescription>
          <LinkContainer>
            <Link>
              <span 
                onClick={() => {
                  navigator.clipboard.writeText(spotLink).then(() => {
                    setIsLinkCopied(true);
                  });
                }}
                style={{ cursor: 'pointer' }}
              >
                {spotLink}
              </span>
            </Link>
          </LinkContainer>
          <div className="color-primary" style={{ marginTop: 10 }}>
            {isLinkCopied && 'Link copiado!'}
          </div>
        </MenuContainer>
      </Menu>
    </>
  );
};

const QrContainer = styled.div`
  margin: 10px;
  padding: 10px;
  border-radius: 4px;
  background-color: white;
`;

const MenuContainer = styled.div`
  width: 350px;
  height: 300px;
  margin-top: 30px;
  outline: none;
  padding: 20px;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: -15px;
  @media (max-width: 500px) {
    width: 300px;
  }
`;

const LinkContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Link = styled.div`
  flex: 10;
  overflow-y: hidden;
  font-size: 12px;
  line-height: 1.3;
  color: #fff;
  margin-top: 10px;
  cursor: pointer;
  @media (max-width: 500px) {
    font-size: 10px;
  }
`;

const SpotName = styled.div`
  font-size: 22px;
  line-height: 1.23;
  text-align: center;
  color: #fff;
`;

const QrDescription = styled.div`
  font-size: 10px;
  line-height: 1.3;
  text-align: center;
  color: #fff;
`;

export default SpotInfoMenu;
