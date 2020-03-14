const divisionModel = require('../models/division')
const subDivisionModel = require('../models/sub-division')

module.exports = {
    create: async (req, res, next) => {
        const { body: { institution_id, name }, userId: moderator_id } = req;

        try {
            const division = await divisionModel.addOne(name, institution_id, moderator_id)
            res.status(201).json({ status: 'success', data: { message: 'Division successfully created', division } })
        } catch (e) {
            next(e)
        }
    },

    fetch: async (req, res, next) => {
        const { params: { institutionId } } = req;

        try {
            const divisions = await divisionModel.fetchAll(institutionId)
            res.status(200).json({ status: 'success', data: divisions })
        } catch (e) {
            next(e)
        }
    },

    view: async (req, res, next) => {
        const { params: { divisionId } } = req

        try {
            const division = await divisionModel.find(divisionId)

            if (!!division) {
                division.sub_divisions = await subDivisionModel.fetchAll(division.id)
            }

            res.status(200).json({ status: 'success', data: division })
        } catch (e) {
            next(e)
        }
    }
}

