const subDivisionModel = require('../models/sub-division')

module.exports = {
    create: async (req, res, next) => {
        const { body: { division_name, name }, userId } = req;

        try {
            const sub_division = await subDivisionModel.addOne(division_name, name, userId)
            res.status(201).json({ status: 'success', data: { message: 'Sub-division successfully created', sub_division } })
        } catch (e) {
            next(e)
        }
    },
}
