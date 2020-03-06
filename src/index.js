require('dotenv').config();

const app = require('./app');

const server = app.listen(process.env.PORT || 3000, (error) => {
    console.log(error ? `Error: ${error}...` : `Listening on PORT: ${server.address().port}`);
});

module.exports = server;
