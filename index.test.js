// install dependencies
const { execSync } = require('child_process')
execSync('npm install')
execSync('npm run seed')

const request = require('supertest')
const { db } = require('./db/connection')
const { Musician } = require('./models/index')
const app = require('./src/app')
const seedMusician = require('./seedData')

describe('./musicians endpoint', () => {
	test('Testing GET all Musicians', async () => {
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
})
