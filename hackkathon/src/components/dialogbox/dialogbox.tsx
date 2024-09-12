import * as React from 'react';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { CgProfile } from 'react-icons/cg';
import { GoAlertFill } from 'react-icons/go';

export default function AlertDialog() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  const navigate = useNavigate();

  const logout = () => {
    Cookies.remove('token');
    navigate('/');
  };

  return (
    <React.Fragment>
      <Button onClick={handleClickOpen}><CgProfile className="text-3xl text-white" /></Button>

      <Dialog open={open} onClose={handleClose} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description">
        <DialogTitle className="text-center" id="alert-dialog-title">
          <div className="flex items-center justify-center gap-x-3"><GoAlertFill className="text-red-800" /> Logout </div>
        </DialogTitle>

        <DialogContent>
          <DialogContentText id="alert-dialog-description">Are you sure you want to logout?</DialogContentText>
        </DialogContent>
        
            <DialogActions> <Button onClick={handleClose}>Disagree</Button> <Button onClick={logout} autoFocus>confirm</Button>
       
        </DialogActions>

      </Dialog>
    </React.Fragment>
  );
}
