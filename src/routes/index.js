const alumnusCardRoutes = require('./alumnus-card');
const alumnusRoutes = require('./alumnus');
const divisionRoutes = require('./division');
const institutionRoutes = require('./institution');
const moderatorRoutes = require('./moderator');
const sessionTermesterRoutes = require('./session-termester');
const sessionRoutes = require('./session');
const subDivisionRoutes = require('./sub-division');
const termesterRoutes = require('./termester');
const userRoutes = require('./user');


module.exports = (router) => {
    alumnusCardRoutes(router);
    alumnusRoutes(router);
    divisionRoutes(router);
    institutionRoutes(router);
    moderatorRoutes(router);
    sessionTermesterRoutes(router);
    sessionRoutes(router);
    subDivisionRoutes(router);
    termesterRoutes(router);
    userRoutes(router);

    // set a default PING / Health-Check route
    router.get('/ping', (req, res) => res.json({ status: 'success', error: 'connected...pong...pong...pong...' }));

    // set a default route
    router.get('/*', (req, res) => res.status(404).json({ status: 'error', error: 'Page no longer exists' }));
    return router;
}
