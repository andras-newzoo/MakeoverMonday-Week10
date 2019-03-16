
const updateSvg  = ( svg, height, width, margin) => {

  svg.attr('height', height).attr('width', width)

  const chartWidth = width - margin.left - margin.right,
        chartHeight =  height - margin.top - margin.bottom

  return { chartWidth, chartHeight }

}

export { updateSvg }
