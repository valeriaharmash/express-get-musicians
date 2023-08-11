const express = require('express')
const router = express.Router()
const musiciansRouter = require('./musicians')
const bandRouter = require('./band')

router.use('/musicians', musiciansRouter)
router.use('/bands', bandRouter)

module.exports = router
