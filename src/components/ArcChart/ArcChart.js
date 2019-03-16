import React, {Component} from 'react'
import './ArcChart.css'

import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom } from 'd3-axis'
import { format } from 'd3-format'
import { max, min } from 'd3-array'
import { interpolateNumber } from 'd3-interpolate'

import { createUpdateArc } from './functionsArcChart'
import { updateSvg, appendArea, appendTitle, moveTitle} from '../chartFunctions'

class ArcChart extends Component {

  componentDidUpdate(prevProps){

    const { data, xKey } = this.props

    if(prevProps.width === 7000){
        this.initVis()
    } else if (prevProps.width !== this.props.width){
        this.updateDims()
    }

    if(max(prevProps.data, d => d[xKey]) !== max(data, d => d[xKey]) ||
      min(prevProps.data, d => d[xKey]) !== min(data, d => d[xKey]))
      {this.updateData()}


  }


  initVis(){
    const svg = select(this.node),
          { data, height, margin, width, chartClass, maxX, colorRange, colorDomain, transition, xKey, colorKey, filter} = this.props,
          { start, delay } = transition,
          { chartWidth, chartHeight } = updateSvg( svg , height, width, margin )

    appendArea(svg, `${chartClass}-chart-area`, margin.left, margin.top)
    appendArea(svg, `${chartClass}-x-axis`, margin.left, margin.top+chartHeight)

    select('#range').attr('value', '2016')

    this.chartArea = svg.select(`.${chartClass}-chart-area`)

    this.xScale = scaleLinear().range([0, chartWidth]).domain([-2, +maxX])

    this.colorScale = scaleOrdinal().range(colorRange).domain(colorDomain)

    const paths = this.chartArea.selectAll('path').data(data),
          xAxis = select(`.${chartClass}-x-axis`)

    xAxis.call(axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(3))
    xAxis.selectAll('.tick line').remove()
    xAxis.select('.domain').attr('stroke', '#33332D')

    svg.append('text')
          .attr('class', 'year-display')
          .attr('x', 0)
          .attr('y', 70)
          .attr('fill', '#33332D')
          .text(filter)
          .attr('text-anchor', 'start')
          .attr('font-size', '96px')
          .attr('font-weight', '300')
          .attr('letter-spacing', '4px')

    appendTitle(this.chartArea, 'arc-chart-title', chartWidth/2, 2, 'Female Life Expectancy per Country')

    createUpdateArc(paths, chartHeight, this.xScale, xKey, this.colorScale, colorKey, 'arcs-in', start, delay, 'arcs-out-start')

  }

  updateData(){

    const svg = select(this.node),
          { height, margin, width, data, xKey, colorKey, transition, filter} = this.props,
          { long } = transition,
          { chartHeight } = updateSvg( svg , height, width, margin ),
          paths = this.chartArea.selectAll('path').data(data)


  svg.select(`.year-display`)
            .transition('year-update')
            .duration(long)
            .tween("text", function() {
                  const that = select(this),
                        i = interpolateNumber(+that.text(), filter);
                  return function(t) {that.text(format('.0f')(i(t)))};
                })

  createUpdateArc(paths, chartHeight, this.xScale, xKey, this.colorScale, colorKey, 'arcs-update', 0, 0, 'arcs-out')

  }

  updateDims(){

    const svg = select(this.node),
          { height, margin, width, chartClass } = this.props,
          { chartWidth, chartHeight } = updateSvg( svg , height, width, margin )

    this.chartArea = svg.select(`.${chartClass}-chart-area`)

    this.xScale.range([0, chartWidth])

    const xAxis = select(`.${chartClass}-x-axis`)

    xAxis.call(axisBottom(this.xScale).tickSizeOuter(0).tickSizeInner(3))
    xAxis.selectAll('.tick line').remove()
    xAxis.select('.domain').attr('stroke', '#33332D')

    this.chartArea.selectAll('path')
          .attr('d', d => {
            return ['M', this.xScale(0), chartHeight, 'A',
              (this.xScale(0) - this.xScale(d.lifeExp))/2, ',',
              (this.xScale(0) - this.xScale(d.lifeExp))/2, 0, 0, ',',
              this.xScale(0) < this.xScale(d.lifeExp) ? 1 : 0, this.xScale(d.lifeExp), ',', chartHeight]
              .join(' ');
          })

    moveTitle(this.chartArea, 'arc-chart-title', chartWidth/2)

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
