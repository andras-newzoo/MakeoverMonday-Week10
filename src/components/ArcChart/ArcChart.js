import React, {Component} from 'react'
import './ArcChart.css'

import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom } from 'd3-axis'

import {} from './functionsArcChart'
import { updateSvg, appendArea} from '../chartFunctions'

class ArcChart extends Component {

  componentDidMount(){


  }

  componentDidUpdate(){

    const { data } = this.props

    this.initVis()

  }


  initVis(){
    const svg = select(this.node),
          { data, height, margin, width, chartClass, maxX, colorRange, colorDomain, transition} = this.props,
          { start, delay } = transition,
          { chartWidth, chartHeight } = updateSvg( svg , height, width, margin )

    appendArea(svg, `${chartClass}-chart-area`, margin.left, margin.top)
    appendArea(svg, `${chartClass}-x-axis`, margin.left, margin.top+chartHeight)

    this.chartArea = svg.select(`.${chartClass}-chart-area`)

    this.xScale = scaleLinear().range([0, chartWidth]).domain([-2, +maxX])

    const colorScale = scaleOrdinal().range(colorRange).domain(colorDomain),
          paths = this.chartArea.selectAll('path').data(data),
          xAxis = select(`.${chartClass}-x-axis`)

    xAxis.call(axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(3))
    xAxis.selectAll('.tick line').remove()
    xAxis.select('.domain').attr('stroke', '#33332D')

    paths
          .enter()
          .append('path')
          .attr('d', d => {
            return ['M', this.xScale(0), chartHeight, 'A',
              (this.xScale(0) - this.xScale(d.lifeExp))/2, ',',
              (this.xScale(0) - this.xScale(d.lifeExp))/2, 0, 0, ',',
              this.xScale(0) < this.xScale(d.lifeExp) ? 1 : 0, this.xScale(d.lifeExp), ',', chartHeight]
              .join(' ');
          })
          .attr('stroke-width', 1.5)
          .attr('stroke', d => colorScale(d.isFistula))
          .attr('fill', 'none')
          .attr('stroke-opacity', 0)
              .merge(paths)
              .transition('paths-in')
              .duration(start)
              .delay((d,i) => i * delay)
              .attr('stroke-opacity', 1)


  }

  render(){
    return(
      <svg ref={node => this.node = node}/>
    )
  }
}
ArcChart.defaultProps = {
  margin: {
    top: 10,
    right: 20,
    bottom: 15,
    left: 10
  },
  transition: {
    start: 2000,
    long: 1000,
    short: 200,
    delay: 20
  }
}

export default ArcChart
