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

function Create() {
  const classes = useStyles();

  return (
    <form className={classes.root} noValidate autoComplete="off">
      <TextField id="outlined-basic" label="User Name" variant="outlined" />
      <TextField id="outlined-basic" label="Number of Players" variant="outlined" />
      <TextField id="outlined-basic" label="Number of Boards" variant="outlined" />
      <TextField id="outlined-basic" label="Number of Boards to Win" variant="outlined" />
      <Button className={classes.button}>
          Create!
      </Button>
    </form>
  );
}

export default Create