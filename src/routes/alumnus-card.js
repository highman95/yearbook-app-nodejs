const alumniCardController = require('../controllers/alumnus-card')

module.exports = (router) => {
    router.post('/alumni-cards', alumniCardController.create)
}
