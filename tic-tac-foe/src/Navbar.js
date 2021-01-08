import React from 'react';
import { Link } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
  },
  link: {
      textDecoration: "none",
      color: "white"
  }
}));

function Navbar() {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu" onClick={()=>{alert(`NOTHING HAPPENS`)}}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TicTacFoe
          </Typography>
          <Link to='/' className={classes.link}>
            <Button color="inherit">Home</Button>
          </Link>
          <Link to='/create' className={classes.link}>
            <Button color="inherit">Create a Room</Button>
          </Link>
          <Link to='/join' className={classes.link}>
            <Button color="inherit">Join a Room</Button>
          </Link>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default Navbar