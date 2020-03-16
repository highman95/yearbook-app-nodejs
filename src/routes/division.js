const divisionController = require('../controllers/division')
const auth = require('../utils/middlewares/auth')

module.exports = (router) => {
    router.get('/divisions/:divisionId', auth, divisionController.view)
    router.post('/divisions', auth, divisionController.create)
}
