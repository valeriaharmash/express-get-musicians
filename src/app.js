const express = require('express')
const app = express()

app.use(express.json())
app.use(express.urlencoded())

app.use('/', require('../routes'))

module.exports = app
