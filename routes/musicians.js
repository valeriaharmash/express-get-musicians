const express = require('express')
const router = express.Router()
const { check, validationResult } = require('express-validator')
const { Musician } = require('../models/index')

router.get('/', async (req, res) => {
	try {
		const data = await Musician.findAll()
		res.json(data)
	} catch (error) {
		console.error(error)
	}
})

router.get('/:id', async (req, res) => {
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

router.post(
	'/',
	[check('name').not().isEmpty().trim()],
	[check('instrument').not().isEmpty().trim()],
	async (req, res, next) => {
		try {
			const errors = validationResult(req)
			if (errors.isEmpty()) {
				const musician = await Musician.create(req.body)

				if (!musician) {
					throw new Error('No musician created')
				}
				res.send(musician)
			} else {
				throw new Error('Name or instrument field is empty')
			}
		} catch (error) {
			next(error)
		}
	}
)

router.put('/:id', async (req, res, next) => {
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

router.delete('/:id', async (req, res, next) => {
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

module.exports = router
