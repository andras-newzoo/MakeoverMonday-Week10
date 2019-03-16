


const createUpdateArc = (
    paths, chartHeight, xScale, xKey, colorScale, colorKey, transition, duration, delay, transitionOut
) => {

  paths.exit().transition(transitionOut).duration(0).remove()

  paths.enter()
        .append('path')
        .attr('d', d => {
          return ['M', xScale(0), chartHeight, 'A',
            (xScale(0) - xScale(d[xKey]))/2, ',',
            (xScale(0) - xScale(d[xKey]))/2, 0, 0, ',',
            xScale(0) < xScale(d[xKey]) ? 1 : 0, xScale(d[xKey]), ',', chartHeight]
            .join(' ');
        })
        .attr('stroke-width', 1.5)
        .attr('stroke', d => colorScale(d[colorKey]))
        .attr('fill', 'none')
        .attr('stroke-opacity', 0)
            .merge(paths)
            .transition(transition)
            .duration(duration)
            .delay((d,i) => i * delay)
            .attr('d', d => {
                return ['M', xScale(0), chartHeight, 'A',
                  (xScale(0) - xScale(d.lifeExp))/2, ',',
                  (xScale(0) - xScale(d.lifeExp))/2, 0, 0, ',',
                  xScale(0) < xScale(d.lifeExp) ? 1 : 0, xScale(d.lifeExp), ',', chartHeight]
                  .join(' ');
              })
            .attr('stroke-opacity', 1)

}


export {createUpdateArc}
