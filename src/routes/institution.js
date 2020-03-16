const institutionController = require('../controllers/institution')
const auth = require('../utils/middlewares/auth')

module.exports = (router) => {
    router.get('/institutions', auth, institutionController.fetch)
    router.post('/institutions', auth, institutionController.create)
    router.get('/institutions/:institutionId', auth, institutionController.view)
}
