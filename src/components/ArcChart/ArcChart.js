import React, {Component} from 'react'
import './ArcChart.css'

import { select } from 'd3-selection'
import { scaleLinear, scaleOrdinal } from 'd3-scale'
import { axisBottom } from 'd3-axis'
import { max, min } from 'd3-array'

import {} from './functionsArcChart'
import { updateSvg, appendArea} from '../chartFunctions'

class ArcChart extends Component {

  componentDidMount(){


  }

  componentDidUpdate(prevProps){

    const { data, xKey } = this.props

    if(prevProps.width === 7000){
        this.initVis()
    } else if (prevProps.width !== this.props.width){
        this.updateDims()
    }

    if(max(prevProps.data, d => d[xKey]) !== max(this.props.data, d => d[xKey]) ||
      min(prevProps.data, d => d[xKey]) !== min(this.props.data, d => d[xKey]))
      {this.updateData()}


  }


  initVis(){
    const svg = select(this.node),
          { data, height, margin, width, chartClass, maxX, colorRange, colorDomain, transition, xKey, colorKey} = this.props,
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

    paths
          .enter()
          .append('path')
          .attr('d', d => {
            return ['M', this.xScale(0), chartHeight, 'A',
              (this.xScale(0) - this.xScale(d[xKey]))/2, ',',
              (this.xScale(0) - this.xScale(d[xKey]))/2, 0, 0, ',',
              this.xScale(0) < this.xScale(d[xKey]) ? 1 : 0, this.xScale(d[xKey]), ',', chartHeight]
              .join(' ');
          })
          .attr('stroke-width', 2)
          .attr('stroke', d => this.colorScale(d[colorKey]))
          .attr('fill', 'none')
          .attr('stroke-opacity', 0)
              .merge(paths)
              .transition('paths-in')
              .duration(start)
              .delay((d,i) => i * delay)
              .attr('stroke-opacity', 1)

  }

  updateData(){

    const svg = select(this.node),
          { height, margin, width, data, xKey, colorKey} = this.props,
          { chartHeight } = updateSvg( svg , height, width, margin ),
          paths = this.chartArea.selectAll('path').data(data)

    paths.exit().remove()

    paths.enter()
          .append('path')
          .attr('d', d => {
            return ['M', this.xScale(0), chartHeight, 'A',
              (this.xScale(0) - this.xScale(d[xKey]))/2, ',',
              (this.xScale(0) - this.xScale(d[xKey]))/2, 0, 0, ',',
              this.xScale(0) < this.xScale(d[xKey]) ? 1 : 0, this.xScale(d[xKey]), ',', chartHeight]
              .join(' ');
          })
          .attr('stroke-width', 2)
          .attr('stroke', d => this.colorScale(d[colorKey]))
          .attr('fill', 'none')
              .merge(paths)
              .attr('d', d => {
                  return ['M', this.xScale(0), chartHeight, 'A',
                    (this.xScale(0) - this.xScale(d.lifeExp))/2, ',',
                    (this.xScale(0) - this.xScale(d.lifeExp))/2, 0, 0, ',',
                    this.xScale(0) < this.xScale(d.lifeExp) ? 1 : 0, this.xScale(d.lifeExp), ',', chartHeight]
                    .join(' ');
                })

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
