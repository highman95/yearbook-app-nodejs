const institutionController = require('../controllers/institution')
const divisionController = require('../controllers/division')

module.exports = (router) => {
    router.get('/institutions', institutionController.fetch)
    router.post('/institutions', institutionController.create)
    router.get('/institutions/:institutionId/divisions', divisionController.fetch)
}
