const alumnusCardModel = require('../models/alumnus-card')

module.exports = {
    create: async (req, res, next) => {
        const { body: { tag_no, institution_id, division_id = null, sub_division_id = null, admission_year = '', graduation_year = '' }, userId: alumnus_id } = req

        try {
            const card = await alumnusCardModel.addOne(alumnus_id, tag_no, institution_id, division_id, sub_division_id, admission_year, graduation_year)
            res.status(201).json({ status: 'success', data: { message: 'Alma-mater successfully registered', card } })
        } catch (e) {
            next(e)
        }
    }
}
