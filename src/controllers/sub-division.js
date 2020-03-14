const subDivisionModel = require('../models/sub-division')

module.exports = {
    create: async (req, res, next) => {
        const { body: { division_id, name }, userId: moderator_id } = req;

        try {
            const sub_division = await subDivisionModel.addOne(division_id, name, moderator_id)
            res.status(201).json({ status: 'success', data: { message: 'Sub-division successfully created', sub_division } })
        } catch (e) {
            next(e)
        }
    },
}
