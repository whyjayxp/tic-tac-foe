import React from 'react'
import Dialog from '@material-ui/core/Dialog';

class Logs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  render() {
    const logItems = this.props.logs.map((log, idx) =>
    <li key={idx}>{log}</li>
    );
    return (
      <Dialog maxWidth={false} onClose={this.props.onClose} open={ this.props.open }>
        <div id="logs">
        <div style={{ 'maxHeight': '50vh', 'overflowY': 'auto', 'marginBottom': '10px' }}>
            <ul className="rulesList">{ logItems }</ul>
        </div>
        <center><i>Click outside to dismiss</i></center>
        </div>
      </Dialog>
    );
  }
}

export default Logs;