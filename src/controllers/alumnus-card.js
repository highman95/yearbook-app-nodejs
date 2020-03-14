const alumnusCardModel = require('../models/alumnus-card')

module.exports = {
    create: async (req, res, next) => {
        const { body: { tag_no, institution_id, division_id, sub_division_id }, userId: alumnus_id = '30bee291-63e6-44d4-8cf1-7e331288779f' } = req

        try {
            const card = await alumnusCardModel.addOne(alumnus_id, tag_no, institution_id, division_id, sub_division_id)
            res.status(201).json({ status: 'success', data: { message: 'Alma-mater successfully registered', card } })
        } catch (e) {
            next(e)
        }
    }
}
