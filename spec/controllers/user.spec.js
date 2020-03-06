require('dotenv').config();

const request = require('request');
const jwt = require('jsonwebtoken');

describe('UserController Test Suite', () => {
    let server;
    let baseUrl;
    let testCredentialsY = {};

    beforeAll(() => {
        server = require('../../src/index');

        const { address, port } = server.address();
        const hostName = address === '::' ? `http://localhost:${port}` : '';
        baseUrl = `${hostName}/api/v1/auth`;

        testCredentialsY = {
            email: 'mark.spencer-' + Date.now() + '@oc.com',
            password: 'markspencer'
        };
    });

    afterAll((done) => server.close(done));

    describe('POST /auth/register', () => {
        let testData = {};
        let options = {};

        beforeAll(() => {
            endPoint = baseUrl + '/register';

            const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
            options = { headers: { token } };
        });

        beforeEach(() => {
            let data = {
                firstName: 'Mark',
                lastName: 'Spencer',
                ...testCredentialsY,
                gender: 'male',
                address: '',
                institutionName: 'University of Calabar'
            };

            testData = Object.assign({}, data);
        });

        describe('firstname / lastname is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.firstName = '';
                testData.lastName = '';
                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('invalid email-address is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.email = 'mail@com';
                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('invalid / blank password is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.password = '';
                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('institution is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.institutionName = '';

                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('non-existing institution is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.institutionName = 'xyz';
                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('all required parameters are sent', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return success message', () => expect(responseBox.body.data.message).toBeDefined());
            it('should return an authentication token', () => expect(responseBox.body.data.token).toBeDefined());
        });
    });

    describe('POST /auth/signin', () => {
        let testCredentials = {}

        beforeAll(() => {
            endPoint = baseUrl + '/signin';
        });

        beforeEach(() => {
            testCredentials = Object.assign({}, testCredentialsY);
        });

        describe('email input is blank', () => {
            let responseBox;

            beforeAll((done) => {
                testCredentials.email = '';

                request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('un-registered email is supplied', () => {
            let responseBox;

            beforeAll((done) => {
                testCredentials.email = 'i-do-code@me.com';

                request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('blank(invalid) password is supplied', () => {
            let responseBox;

            beforeAll((done) => {
                testCredentials.password = '';

                request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('valid credentials are supplied', () => {
            let responseBox;

            beforeAll((done) => {
                request.post(endPoint, { form: testCredentials, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });


            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return an authentication token', () => expect(responseBox.body.data.token).toBeDefined());
        });
    });
});
