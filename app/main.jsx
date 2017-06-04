import React    from 'react';
import ReactDOM from 'react-dom';
import Header   from './component/head/head.jsx';
import Upload   from './component/uploadBtn/uploadbtn.jsx';
import VersionTalbe from './component/table/table.jsx';

class App extends React.Component {
    render(){
        return(
            <div>
              <Header></Header>
              <Upload></Upload>
              <VersionTalbe></VersionTalbe>
            </div>
        )
    }
}

ReactDOM.render(
  <App></App>,
  document.getElementById('app')
);