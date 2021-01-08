import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    marginTop: '150px',
  },
  button: {
    backgroundColor: '#3f51b5',
    color: 'white',
  }
}));

function Join() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="outlined-basic" label="User Name" variant="outlined" />
      <TextField id="outlined-basic" label="Enter Room Code" variant="outlined" />
      <Button className={classes.button}>
          Join now!
      </Button>
    </form>
  );
}

export default Join