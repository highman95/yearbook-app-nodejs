const divisionController = require('../controllers/division')

module.exports = (router) => {
    router.post('/divisions', divisionController.create)
}
