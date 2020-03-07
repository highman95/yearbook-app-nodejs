const institutionController = require('../controllers/institution')

module.exports = (router) => {
    router.post('/institutions', institutionController.create)
}
