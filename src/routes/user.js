const alumnusController = require('../controllers/alumnus');

module.exports = (router) => {
    router.post('/auth/signin', alumnusController.authenticate);
    router.post('/auth/register', alumnusController.create);
}
