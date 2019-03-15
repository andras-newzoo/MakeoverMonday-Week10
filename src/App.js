import React, { Component } from 'react';
import './App.css';

import {ArcChart, BarChart} from './components'

import { List, Accordion, Icon } from 'semantic-ui-react'

import countryData from './data/countryData.json'
import annualAvg from './data/annualAvg.json'




class App extends Component {
  constructor(props){
    super(props)
    this.state = {
        filter : 2016,
        container : {
          height : undefined,
          width: 10000
        },
        activeIndex: 2
    }

  this.handleResize = this.handleResize.bind(this)
  this.handleClick = this.handleClick.bind(this)
  this.handleSliderChange = this.handleSliderChange.bind(this)
  }

  componentDidMount(){

    window.addEventListener("resize", this.handleResize);
    this.handleResize()

  }


  handleSliderChange(e){
    let value = e.target.value,
        copy = {...this.state}

    copy.filter = value
    this.setState( copy )
  }


  handleResize() {
  this.setState({
    container: {
      height: this.container && this.container.clientHeight,
      width: this.container && this.container.clientWidth
    }
  });
}

  handleClick(e, titleProps){

    const { index } = titleProps,
          { activeIndex } = this.state,
          newIndex = activeIndex === index ? -1 : index

   this.setState({ activeIndex: newIndex })

  }


  render() {

    const   { filter, container, activeIndex  } = this.state,
            { value } = this.props,
            { width, height } = container,
            filteredAnnualAvg = annualAvg.filter(d => d.year === +filter),
            filteredCountryData = countryData.filter(d => d.year === +filter),
            colorDomain = [...new Set(annualAvg.map(d => d.isFistula))]


    return (
      <div className="graph-container">
        <div className='header-container'>
          <div id='title'>
            <h1 >Operation</h1>
            <h2 >Fistula</h2>
          </div>
          <div id='accordion'>
            <Accordion styled>
              <Accordion.Title active={activeIndex === 0} index={0} onClick={this.handleClick}>
                <Icon name='dropdown' />
                What is a Operation Fistula?
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 0}>
                <p>
                  It is aimed at ending obstetric fistula for every woman everywhere.
                  Obstetric fistula primarily affects women in remote areas of the world that contributes to a poor level of understanding of the condition, and a lack of data on its prevalence and incidence globally.
                </p>
              </Accordion.Content>
              <Accordion.Title active={activeIndex === 1} index={1} onClick={this.handleClick}>
                <Icon name='dropdown' />
                What does Operation Fistula work for?
              </Accordion.Title>
              <Accordion.Content active={activeIndex === 1}>
                <p>
                  Operation Fistula works to solve three problems:
                  <ul>
                    <li>- That funding doesn’t reach the people who need it.</li>
                    <li>- Organizations don’t collaborate well.</li>
                    <li>- Fistula is seen as a low priority symptom.</li>
                  </ul>
                </p>
              </Accordion.Content>
            </Accordion>
            </div>
          </div>
          <div className="range-container">
            <form action="#">
              <p className="range-field">
                <input id='range' type="range" min="1960" max="2016" onChange={this.handleSliderChange}/>
              </p>
            </form>
          </div>
        <div className="App" ref={parent => (this.container = parent)}>
            <div className='archart-container'>
              <ArcChart
                data = {filteredCountryData}
                chartClass = {'arcchart'}
                height = {height}
                width = {width * .7}
                xKey = {'lifeExp'}
                colorKey = {'isFistula'}
                colorRange = {['#33332D', '#B2431A']}
                colorDomain = {colorDomain}
                maxX = {92}
              />
            </div>
            <div className='barchart-container'>
              <BarChart
                data = {filteredAnnualAvg}
                height = {height}
                width = {width * .3}
                chartClass = {'barchart'}
                xKey = {'isFistula'}
                yKey = {'lifeExp'}
                maxY = {85}
                colorRange = {['#33332D', '#B2431A']}
                secondaryColorRange = {['#A5A59D', '#E5A289']}
                colorDomain = {colorDomain}
                padding = {.3}
              />
            </div>
        </div>
        <div id='credit'>
          <List bulleted horizontal link>
              <List.Item as='a'>Built and somewhat redesigned by: Andras Szesztai</List.Item>
              <List.Item as='a'>Original design and text: Daniel Ling</List.Item>
              <List.Item as='a'>#MakeoverMonday Week 10 2019</List.Item>
              <List.Item as='a'>Data: World Bank</List.Item>
          </List>
        </div>
      </div>
    );
  }
}

App.defaultProps = {

}

export default App;
