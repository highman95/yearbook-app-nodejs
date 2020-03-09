const institutionModel = require('../models/institution')

module.exports = {
    create: async (req, res, next) => {
        const { body: { name, short_name }, userId: moderator_id } = req;// TODO: remove

        try {
            const institution = await institutionModel.addOne(name, short_name, moderator_id);
            res.status(201).json({ status: 'success', data: { message: 'Institution successfully created', institution } });
        } catch (e) {
            next(e)
        }
    },

    fetch: async (req, res, next) => {
        try {
            const institutions = await institutionModel.fetchAll()
            res.status(200).json({ status: 'success', data: institutions })
        } catch (e) {
            next(e)
        }
    }
}
