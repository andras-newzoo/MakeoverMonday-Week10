import React, {Component} from 'react'
import './ArcChart.css'

import {} from './functionsArcChart'

class ArcChart extends Component {

  componentDidMount(){

  }

  componentDidUpdate(){

  }

  render(){
    return(
      <svg ref={node => this.node = node}/>
    )
  }
}

export default ArcChart
