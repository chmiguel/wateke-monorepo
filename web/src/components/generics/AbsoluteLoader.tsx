import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

interface Props {
  opacity?: number;
  visible?: boolean;
  onClick?: () => void;
  noLoader?: boolean;
  success?: boolean;
  thickness?: number;
  size?: number;
  message?: number;
}

const AbsoluteLoader: React.FC<Props> = props => {
  const opacity = props.opacity || 0.7;
  return (
    <div
      style={{
        position: 'relative',
        maxHeight: props.visible ? '100vh' : undefined,
        overflow: props.visible ? 'hidden' : undefined,
      }}
    >
      {props.children}
      <div
        onClick={props.onClick}
        className={props.onClick ? 'opacity' : undefined}
        style={{
          //opacity: props.visible? 0.9 : 0.0,
          backgroundColor: props.visible
            ? `rgba(39,39,39, ${opacity})`
            : '#000088',
          transitionDuration: '2s',
          transitionProperty: 'opacity',
          display: props.visible ? 'flex' : 'none',
          alignItems: 'center',
          justifyContent: 'center',
          position: 'absolute',
          flexDirection: 'column',
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
        }}
      >
        {props.visible && !props.noLoader && !props.success ? (
          <CircularProgress
            thickness={props.thickness || 3}
            size={props.size || 60}
          />
        ) : null}
        {
          <p style={{ marginTop: 10 }} className="small-text white-text">
            {props.message}
          </p>
        }
      </div>
    </div>
  );
};

export default AbsoluteLoader;
