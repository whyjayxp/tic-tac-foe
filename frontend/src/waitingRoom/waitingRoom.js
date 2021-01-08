import React from 'react';
import { Link } from 'react-router-dom'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';

class Waiting extends React.Component {
  render() {
    return (
      <div>
        <form className="create" noValidate autoComplete="off">
          {/* <TextField id="outlined-basic" label="User Name" variant="outlined" /> */}
          <TextField id="outlined-basic" label="Number of Boards" variant="outlined" />
          <TextField id="outlined-basic" label="Number of Boards to Win" variant="outlined" />
          {/* <TextField id="outlined-basic" label="Enter Room Code" variant="outlined" /> */}
          <Link to="/games">
            <Button className="home-button" onClick={this.props.value}>
                Start Game!
            </Button>
          </Link>
        </form>
      </div>
    );
  }
  
}

export default Waiting