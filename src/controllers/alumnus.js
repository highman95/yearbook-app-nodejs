const alumnusModel = require('../models/alumnus')
const { generateToken } = require('../utils/helper')

module.exports = {
    create: async (req, res, next) => {
        const { first_name, last_name, birth_date, gender, email, password, address } = req.body

        try {
            const alumnus = await alumnusModel.addOne(first_name, last_name, birth_date, gender, email, password, address)
            const token = generateToken({ user_id: alumnus.id })
            res.status(201).json({ status: 'success', data: { message: 'User account successfully created', user: { first_name, last_name }, token } })
        } catch (e) {
            next(e)
        }
    },
}
