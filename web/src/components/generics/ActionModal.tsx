import React from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Slide from '@material-ui/core/Slide';

function Transition(props: any) {
  return <Slide direction="up" {...props} />;
}

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
