import React, { Component } from 'react';
import { select } from 'd3-selection'
import './App.css';
import * as _ from 'lodash'

import {ArcChart, BarChart} from './components'

import countryData from './data/countryData.json'
import annualAvg from './data/annualAvg.json'

class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        filter : 2016,
        container : {
          height : undefined,
          width: undefined
        }
    }
  this.handleResize = this.handleResize.bind(this)
  }

  componentDidMount(){

    window.addEventListener("resize", this.handleResize);
    this.handleResize()

  }

  handleResize() {
  this.setState({
    container: {
      height: this.container && this.container.clientHeight,
      width: this.container && this.container.clientWidth
    }
  });
}



  render() {

    const   { filter, container  } = this.state,
            { width, height } = container,
            filteredAnnualAvg = annualAvg.filter(d => d.year === +filter),
            filteredCountryData = countryData.filter(d => d.year === +filter),
            colorDomain = [...new Set(annualAvg.map(d => d.isFistula))]



    return (
      <div className="App" ref={parent => (this.container = parent)}>
          <ArcChart
            data = {filteredCountryData}
            chartClass = {'arcchart'}
            height = {height}
            width = {width}
            xKey = {''}
          />
          <BarChart
            data = {filteredAnnualAvg}
            height = {height}
            width = {width}
            chartClass = {'barchart'}
            xKey = {'isFistula'}
            yKey = {'lifeExp'}
            maxY = {80}
            colorRange = {['#33332D', '#B2431A']}
            colorDomain = {colorDomain}
            padding = {.1}
          />
      </div>
    );
  }
}

export default App;
