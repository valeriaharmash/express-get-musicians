// install dependencies
const { execSync } = require('child_process')
execSync('npm install')
execSync('npm run seed')

const request = require('supertest')
const { db } = require('./db/connection')
const { Musician, Band } = require('./models/index')
const app = require('./src/app')
const seedMusician = require('./seedData')

describe('/musicians endpoint', () => {
	test('GET returns all Musicians', async () => {
		const res = await request(app).get('/musicians')
		expect(res.statusCode).toBe(200)
	})

	test('Testing GET one Musician', async () => {
		const musicianId = 1
		const res = await request(app).get(`/musicians/${musicianId}`)
		expect(res.statusCode).toBe(200)
	})

	test('POST creates musician and returns it', async () => {
		const musicianData = { name: 'John Doe', instrument: 'Piano' }

		const response = await request(app)
			.post('/musicians')
			.send(musicianData)
			.expect(200)

		expect(response.body).toMatchObject(musicianData)
	})

	test('updates a musician and returns status 200', async () => {
		const musician = await Musician.create({
			name: 'Old Name',
			instrument: 'Old Instrument'
		})

		const updatedData = { name: 'New Name', instrument: 'New Instrument' }

		const response = await request(app)
			.put(`/musicians/${musician.id}`)
			.send(updatedData)
			.expect(200)

		expect(response.status).toBe(200)
	})

	test('deletes a musician and returns status 200', async () => {
		const musician = await Musician.create({
			name: 'Musician to Delete',
			instrument: 'Instrument to Delete'
		})

		const response = await request(app)
			.delete(`/musicians/${musician.id}`)
			.expect(200)

		expect(response.status).toBe(200)
	})

	test('should return error if name field is empty', async () => {
		const invalidNameData = {
			name: '',
			instrument: 'guitar'
		}
		const res = await request(app).post('/musicians').send(invalidNameData)

		expect(res.status).toBe(500)
		expect(res.text).toContain('Name or instrument field is empty')
	})
})

describe('/bands endpoint', () => {
	test('returns bands with musicians', async () => {
		const bandsWithMusicians = await Band.findAll({ include: Musician })

		const response = await request(app).get('/bands').expect(200)

		expect(Array.isArray(response.body)).toBe(true)

		const expectedBandsWithMusicians = bandsWithMusicians.map((band) => {
			return {
				...band.toJSON(),
				createdAt: band.createdAt.toISOString(),
				updatedAt: band.updatedAt.toISOString(),
				musicians: band.musicians.map((musician) => {
					return {
						...musician.toJSON(),
						createdAt: musician.createdAt.toISOString(),
						updatedAt: musician.updatedAt.toISOString()
					}
				})
			}
		})

		expect(response.body).toEqual(expectedBandsWithMusicians)
	})

	test('fetches a band by ID with included musicians', async () => {
		const bandId = 1
		const targetBand = await Band.findOne({
			where: { id: bandId },
			include: Musician
		})

		const response = await request(app).get(`/bands/${bandId}`).expect(200)

		expect(response.body).toEqual(
			expect.objectContaining({
				id: 1,
				name: 'The Beatles',
				genre: 'Rock'
			})
		)
	})
})
