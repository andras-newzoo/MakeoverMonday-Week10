import React, {Component} from 'react'
import { max } from 'd3-array'
import { select } from 'd3-selection'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale'
import './BarChart.css'

import { updateSvg } from './functionsBarChart'

class BarChart extends Component {

  componentDidMount(){

    const { data, width, height } = this.props

    console.log(data)
  }

  componentDidUpdate(){




  }


  initVis(){

    const svg = select(this.node),
          { data, height, width, margin, chartClass, xKey, yKey, colorRange, colorDomain, maxY, padding, transition } = this.props,
          { start } = this.transition,
          { chartWidth, chartHeight } =    updateSvg( svg , height, width, margin )

    svg.append('g')
        .attr('class', `${chartClass}-chart-area`)
        .attr('transform', `translate(${margin.left}, ${margin.top})`)

    this.chartArea = select(`${chartClass}-chart-area`)
    this.xScale = scaleBand().range([0, chartWidth]).domain(data.map(d => d[xKey])).padding(+padding)
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, maxY])
    this.colorScale = scaleOrdinal().range(colorRange).domain(colorDomain)


    const rects = this.chartArea.selectAll(`.${chartClass}-rect`).data(data)

          rects.enter()
                .append('rect')
                .attr('class', `${chartClass}-rect`)
                .attr('x', d => this.xScale(d[xKey]))
                .attr('y', this.yScale(0))
                .attr('width', this.yScale.bandwidth())
                .attr('height', 0)
                .attr('fill', d => this.colorScale(d[xKey]))
                    .merge(rects)





  }

  updateData(){
    const svg = select(this.node),
          { data, chartClass } = this.props

    this.xScale.domain(data.map(d => d.isFistula))
    this.yScale.domain([0, 80])





  }

  updateDims(){

    const   svg = select(this.node),
            { height, width, margin, chartClass } = this.props,
            { chartWidth, chartHeight } =    updateSvg( svg , height, width, margin )

    this.xScale = scaleBand().range([0, chartWidth])
    this.yScale = scaleLinear().range([chartHeight, 0])


  }

  render(){
    return(
      <svg ref={node => this.node = node}/>
    )
  }
}

BarChart.defaultProps = {
  margin: {
    top: 10,
    right: 10,
    bottom: 10,
    left: 10
  },
  transition: {
    start: 2000,
    long: 1000,
    short: 300
  }
}

export default BarChart
