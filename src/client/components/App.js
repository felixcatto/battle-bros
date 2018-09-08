import React from 'react';
import './App.scss';
import { getAverageEHP } from '../math';


export default class App extends React.Component {
  render() {
    // console.log(getAverageEHP);
    return (
      <div className="app__container container pt-30 pb-30">
        <div className="row">
          <div className="col-4">
            left col
          </div>
          <div className="col-8">
            right col
          </div>
        </div>
      </div>
    );
  }
}
