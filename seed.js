const { Musician, Band } = require('./models/index')
const { db } = require('./db/connection')
const { seedMusician, seedBand } = require('./seedData')

const getRandomInt = (max) => {
	return Math.floor(Math.random() * max)
}

const syncSeed = async () => {
	await db.sync({ force: true })

	const createdBands = await Promise.all(
		seedBand.map((band) => {
			return Band.create(band)
		})
	)

	await Promise.all(
		seedMusician.map((musician) => {
			const randomBandIdx = getRandomInt(createdBands.length)
			musician.bandId = createdBands[randomBandIdx].id
			return Musician.create(musician)
		})
	)
}

syncSeed()
