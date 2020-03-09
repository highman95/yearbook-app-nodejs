const divisionController = require('../controllers/division')

module.exports = (router) => {
    router.get('/divisions/:divisionId', divisionController.view)
    router.post('/divisions', divisionController.create)
}
