const express = require('express')
const app = express()
const { Musician } = require('../models/index')
const { db } = require('../db/connection')

const port = 3000

app.get('/musicians', async (req, res) => {
	try {
		const data = await Musician.findAll()
		res.json(data)
	} catch (error) {
		console.error(error)
	}
})

app.get('/musicians/:id', async (req, res) => {
	try {
		const musician = await Musician.findOne({
			where: {
				id: req.params.id
			}
		})
		if (musician) {
			res.send(musician)
			return
		}
		res.status(404).send("Musician doesn't exist.")
	} catch (error) {
		console.error(error)
	}
})

module.exports = app
