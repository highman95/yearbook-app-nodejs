const subDivisionController = require('../controllers/sub-division')
const auth = require('../utils/middlewares/auth')

module.exports = (router) => {
    router.post('/sub-divisions', auth, subDivisionController.create)
}
