const express = require('express')
const router = express.Router()
const { Band, Musician } = require('../models/index')

router.get('/', async (req, res) => {
	try {
		const data = await Band.findAll({
			include: Musician
		})
		res.json(data)
	} catch (error) {
		console.error(error)
	}
})

router.get('/:id', async (req, res) => {
	try {
		const band = await Band.findOne({
			where: {
				id: req.params.id
			},
			include: Musician
		})
		if (band) {
			res.send(band)
			return
		}
		res.status(404).send("Band doesn't exist.")
	} catch (error) {
		console.error(error)
	}
})

module.exports = router
