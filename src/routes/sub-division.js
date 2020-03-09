const subDivisionController = require('../controllers/sub-division')

module.exports = (router) => {
    router.post('/sub-divisions', subDivisionController.create)
}
