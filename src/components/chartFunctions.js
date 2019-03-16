
const updateSvg  = ( svg, height, width, margin) => {

  svg.attr('height', height).attr('width', width)

  const chartWidth = width - margin.left - margin.right,
        chartHeight =  height - margin.top - margin.bottom

  return { chartWidth, chartHeight }

},
appendArea = (
  area,
  className,
  left,
  top
) => {
  area.append('g')
    .attr('class', className)
    .attr('transform', `translate(${left}, ${top})`)
},
appendTitle = (
  area, className, x, y, text
) => {

  area.append('text')
        .attr('class', className)
        .attr('x', x)
        .attr('y', y)
        .attr('fill', '#33332D')
        .text(text)
        .attr('text-anchor', 'middle')
        .attr('font-size', '1rem')

},
moveTitle = (
    area, className, x
) => {
  area.select(`.${className}`).attr('x', x)
}

export { updateSvg, appendArea, appendTitle, moveTitle }
