const express = require('express')
const app = express()
const { Musician } = require('../models/index')
const { db } = require('../db/connection')

const port = 3000

app.use(express.json())
app.use(express.urlencoded())

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

app.post('/musicians', async (req, res, next) => {
	try {
		const musician = await Musician.create(req.body)

		if (!musician) {
			throw new Error('No musician created')
		}
		res.send(musician)
	} catch (error) {
		next(error)
	}
})

app.put('/musicians/:id', async (req, res, next) => {
	try {
		const updated = await Musician.update(req.body, {
			where: {
				id: req.params.id
			}
		})

		console.log(updated)

		if (updated[0] === 0) {
			throw new Error('No update made')
		}

		res.sendStatus(200)
	} catch (error) {
		next(error)
	}
})

app.delete('/musicians/:id', async (req, res, next) => {
	try {
		const deleted = await Musician.destroy({
			where: {
				id: req.params.id
			}
		})

		console.log(deleted)

		if (deleted === 0) {
			throw new Error('No musician deleted')
		}

		res.sendStatus(200)
	} catch (error) {
		next(error)
	}
})

module.exports = app
