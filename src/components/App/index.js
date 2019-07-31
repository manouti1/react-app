import React,{Component} from 'react';
import Main from '../Main';
import 'whatwg-fetch';


class App extends Component{
    render() {
        return (
          <div className="App">       
            <Main />
          </div>
        );
      }
}

export default App;