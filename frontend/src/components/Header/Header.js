import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Logo from '../../images/websiteImages/Icon.png';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    fontFamily: "Montserrat",
    fontWeight: 700,
    variant: "h6",
    cursor: 'pointer',
  },
  customAppbarColor: {
    backgroundColor: 'rgb(12, 133, 135)',
  },
  logo: {
    marginLeft: theme.spacing(10),
    cursor: 'pointer',
    width: 60,
    height: 50,
  },
  login: {
    marginRight: theme.spacing(6),
    color: 'inherit',
  }
}));

export default function ButtonAppBar() {
  const classes = useStyles();
  const navigate = useNavigate();

  // Redirect to login page
  const handleLoginClick = () => {
    navigate('/login');
  }

  // Redirect to homepage page if user is logged in. Else redirect to landing page.
  const handleTitleClick = () => {
    navigate('/');
  }

  return (
    <div className={classes.root}>
      <AppBar position="static" classes={{root: classes.customAppbarColor}}>
        <Toolbar>
          <img src={Logo} alt="Logo" className={classes.logo} />
          <Typography variant="h6" className={classes.title} onClick={handleTitleClick}>
            ALGO-ARENA
          </Typography>
          <Button onClick={handleLoginClick} className={classes.login}>Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}
