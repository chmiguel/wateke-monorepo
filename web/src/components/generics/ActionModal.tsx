import React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Slide from '@mui/material/Slide';

const Transition = React.forwardRef(function Transition(props: any, ref) {
  return <Slide direction="up" ref={ref} {...props} />;
});

interface Props {
  cancelAction?: () => void;
  acceptAction?: () => void;
  onClose?: () => void;
  title?: string;
  open: boolean;
  description?: string;
  cancelTitle?: string;
  acceptTitle?: string;
}

const ActionModal: React.FC<Props> = ({
  title = 'Información',
  onClose,
  acceptAction,
  cancelAction,
  open,
  description,
  cancelTitle = 'Cancelar',
  acceptTitle = 'Aceptar',
}) => {
  const handleClose = () => {
    if (onClose) {
      onClose();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      TransitionComponent={Transition}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        style: { margin: 16 },
      }}
    >
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {description}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={cancelAction} color="primary">
          {cancelTitle}
        </Button>
        <Button onClick={acceptAction} color="primary" autoFocus>
          {acceptTitle}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ActionModal;
