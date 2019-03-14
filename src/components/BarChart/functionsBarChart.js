import {select} from 'd3-selection'

const updateSvg  = ( svg, height, width, margin) => {

  svg.attr('height', height).attr('width', width)

  const chartWidth = width - margin.left - margin.rigth,
        chartHeight =  height - margin.top - margin.bottom

  return { chartWidth, chartHeight }

}

export { updateSvg }
