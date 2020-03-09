const divisionModel = require('../models/division')

module.exports = {
    create: async (req, res, next) => {
        const { body: { institution_name, name }, userId } = req;

        try {
            const division = await divisionModel.addOne(institution_name, name, userId)
            res.status(201).json({ status: 'success', data: { message: 'Division successfully created', division } })
        } catch (e) {
            next(e)
        }
    },
}

