const institutionController = require('../controllers/institution')

module.exports = (router) => {
    router.get('/institutions', institutionController.fetch)
    router.post('/institutions', institutionController.create)
    router.get('/institutions/:institutionId', institutionController.view)
}
