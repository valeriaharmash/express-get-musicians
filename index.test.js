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
})
