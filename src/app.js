const express = require('express');
const path = require('path');
const hbs = require('hbs');
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')

const app = express()
const port = 3000

// Define path for Express config
const publicDir = path.join(__dirname, '../public') 
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

//Setup handlebars enging and views location
app.set('view engine', 'hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

//Setup static directory to serve
app.use(express.static(publicDir))

app.get('', (req, res) => {
  res.render('index', {
    title: 'Weather',
    name: 'Narender Saharan'
  })
})

app.get('/about', (req, res) => {
  res.render('about', {
    title: 'About Me',
    name: 'Narender Saharan'
  })
})

app.get('/help', (req, res) => {
  res.render('help', {
    title: 'Help',
    name: 'Narender Saharan',
    helpText: 'This is some helpfull text'
  })
})

app.get('/weather', (req, res) => {
    if(!req.query.address){
      return res.send({
        error: 'You must provide a address'
      })
    }

    geocode(req.query.address, (error, {lattitude, longitude, location} = {}) => {
      if(error){
        return res.send({error})
      }
      forecast(lattitude, longitude, (error, forecastData) => {
        if(error){
          return res.send({error})
        }

        res.send({
          forecast: forecastData,
          location,
          address: req.query.address
        })
      })
    })
})

app.get('/products', (req, res) => {
  if(!req.query.search){
    return res.send({
      error: 'You must provide a search term'
    })
  }
  res.send({
      products: []
  })
})

app.get('/help/*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Narender Saharan',
    errorMessage: 'Help article not found'
  })
})

app.get('*', (req, res) => {
  res.render('404', {
    title: '404',
    name: 'Narender Saharan',
    errorMessage: 'Page not found'
  })
})

app.listen(port, () => {
  console.log(`App listening at http://localhost:${port}`)
})