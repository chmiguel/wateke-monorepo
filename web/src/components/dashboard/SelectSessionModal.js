import React from 'react'
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';


class AlertDialog extends React.Component {
    state = {
      open: false,
    };
  
    handleClickOpen = () => {
      this.setState({ open: true });
    };
  
    handleClose = () => {
      if(this.props.onClose){
          this.props.onClose()
      }
    };
  
    render() {
      return (
          <Dialog
            open={this.props.open}
            onClose={this.handleClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
          >
            <DialogTitle id="alert-dialog-title">{"Se ha detectado otra conexion de administrador"}</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Se ha detectado otra sesion activa, selecciona el rol que quieres tener en este dispositivo
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button onClick={this.handleClose} color="primary">
                ADMINISTRADOR
              </Button>
              <Button onClick={this.props.onPressAdmin} color="primary" autoFocus>
                REPRODUCTOR
              </Button>
            </DialogActions>
          </Dialog>
      );
    }
  }
  
  export default AlertDialog;