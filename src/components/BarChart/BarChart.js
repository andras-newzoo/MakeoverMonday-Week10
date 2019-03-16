import React, {Component} from 'react'
import { select } from 'd3-selection'
import { transition } from 'd3-transition'
import { axisBottom } from 'd3-axis'
import { min, max } from 'd3-array'
import { format } from 'd3-format'
import { scaleBand, scaleLinear, scaleOrdinal } from 'd3-scale'
import { interpolateNumber } from 'd3-interpolate'
import './BarChart.css'

import { } from './functionsBarChart'
import { updateSvg, appendArea} from '../chartFunctions'

class BarChart extends Component {

  componentDidUpdate(prevProps){

        const { yKey} = this.props

        if(prevProps.width === 3000 ) {this.initVis()}
        else if (prevProps.width !== this.props.width) {this.updateDims()}

        if(max(prevProps.data, d => d[yKey]) !== max(this.props.data, d => d[yKey]) ||
          min(prevProps.data, d => d[yKey]) !== min(this.props.data, d => d[yKey]))
          {this.updateData()}

  }


  initVis(){

    const svg = select(this.node),
          { data, height, width, margin, chartClass, xKey, yKey, colorRange, secondaryColorRange, colorDomain, maxY, padding, transition } = this.props,
          { start, delay } = transition,
          { chartWidth, chartHeight } =    updateSvg( svg , height, width, margin )

    appendArea(svg,`${chartClass}-chart-area`, margin.left, margin.top )
    appendArea(svg,`${chartClass}-x-axis x-axis`, margin.left, margin.top + chartHeight )

    this.chartArea = select(`.${chartClass}-chart-area`)
    this.xScale = scaleBand().range([0, chartWidth]).domain(data.map(d => d[xKey])).padding(+padding)
    this.yScale = scaleLinear().range([chartHeight, 0]).domain([0, +maxY])

    const colorScale = scaleOrdinal().range(colorRange).domain(colorDomain),
          secondaryColorScale = scaleOrdinal().range(secondaryColorRange).domain(colorDomain),
          xAxis = select(`.${chartClass}-x-axis`),
          rects = this.chartArea.selectAll(`.${chartClass}-rect`).data(data),
          texts = this.chartArea.selectAll(`.${chartClass}-text`).data(data)

    xAxis.call(axisBottom(this.xScale).tickSizeOuter(0))
    xAxis.selectAll('.tick').remove()
    xAxis.select('.domain').attr('stroke', '#33332D')

          this.chartArea.append('text')
                .attr('class', 'bar-chart-title')
                .attr('x', chartWidth/2)
                .attr('y', 2)
                .attr('fill', '#33332D')
                .text('Average Female Life Expectancy')
                .attr('text-anchor', 'middle')
                .attr('font-size', '1rem')

          rects.enter()
                .append('rect')
                .attr('class', `${chartClass}-rect`)
                .attr('x', d => this.xScale(d[xKey]))
                .attr('y', this.yScale(0))
                .attr('width', this.xScale.bandwidth())
                .attr('height', 0)
                .attr('fill', d => colorScale(d[xKey]))
                    .merge(rects)
                    .transition('rects-in')
                    .duration(start)
                    .delay((d,i) => i * delay)
                    .attr('height', d => this.yScale(0) - this.yScale(d[yKey]))
                    .attr('y', d => this.yScale(d[yKey]))

          texts.enter()
                .append('text')
                .attr('class', `${chartClass}-text`)
                .attr('x', d => this.xScale(d[xKey])+ this.xScale.bandwidth()/2)
                .attr('text-anchor', 'middle')
                .attr('y', chartHeight)
                .attr('font-size', '2rem')
                .attr('font-weight', 800)
                .attr('dy', + 30)
                .attr('opacity', 0)
                .text(0)
                .attr('fill', d => secondaryColorScale(d[xKey]))
                      .merge(texts)
                      .transition('texts-in')
                      .duration(start)
                      .delay((d,i) => i * delay)
                      .attr('y', d => this.yScale(d[yKey]))
                      .attr('opacity', 1)
                      .tween("text", function(d) {
                            const that = select(this),
                                i = interpolateNumber(+that.text(), d[yKey]);
                            return function(t) {that.text(format('.1f')(i(t)))};
                          })
  }

  updateData(){

    const { data, chartClass, yKey, transition } = this.props,
          { long } = transition

    this.chartArea.selectAll(`.${chartClass}-rect`)
              .data(data)
              .transition('rect-update')
              .duration(long)
              .attr('height', d => this.yScale(0) - this.yScale(d[yKey]))
              .attr('y', d => this.yScale(d[yKey]))

    this.chartArea.selectAll(`.${chartClass}-text`)
              .data(data)
              .transition('text-update')
              .duration(long)
              .attr('y', d => this.yScale(d[yKey]))
              .tween("text", function(d) {

                    const that = select(this),
                          i = interpolateNumber(+that.text(), d[yKey]);
                    return function(t) {that.text(format('.1f')(i(t)))};
                  })
  }

  updateDims(){

    const   svg = select(this.node),
            { height, width, margin, chartClass, padding, xKey , data} = this.props,
            { chartWidth } =    updateSvg( svg , height, width, margin ),
            xAxis = this.chartArea.select('.x-axis')

    this.xScale.range([0, chartWidth]).padding(+padding)

    xAxis.call(axisBottom(this.xScale).tickSizeOuter(0))
    xAxis.selectAll('.tick').remove()
    xAxis.selectAll('text').remove()
    xAxis.select('.domain').attr('stroke', '#33332D')

    this.chartArea.selectAll(`.${chartClass}-rect`)
        .attr('x', d => this.xScale(d[xKey]))
        .attr('width', this.xScale.bandwidth())

    this.chartArea.selectAll(`.${chartClass}-text`).attr('x', d => this.xScale(d[xKey])+ this.xScale.bandwidth()/2)

    this.chartArea.select('.bar-chart-title')
        .attr('x', chartWidth/2)

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
    bottom: 15,
    left: 20
  },
  transition: {
    start: 2000,
    long: 1000,
    short: 300,
    delay: 1000
  }
}

export default BarChart
