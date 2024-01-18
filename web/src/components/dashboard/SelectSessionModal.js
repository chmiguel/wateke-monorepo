import React from 'react'
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';


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