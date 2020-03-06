require('dotenv').config();

const request = require('request');
const jwt = require('jsonwebtoken');

describe('InstitutionController Test Suite', () => {
    let server;
    let endPoint;
    let options = {};
    let institutionId;

    beforeAll(() => {
        server = require('../../src/index');

        const { address, port } = server.address();
        const hostName = address === '::' ? `http://localhost:${port}` : '';
        endPoint = `${hostName}/api/v1/institutions`;

        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
        options = { headers: { token } };
    });

    // afterAll((done) => server.close(done));

    describe('POST /institutions', () => {
        let testData = {};

        beforeEach(() => {
            let data = {
                name: process.env.TEST_INSTITUTE,
                shortName: process.env.TEST_INSTITUTE_SHORT_NAME,
            };

            testData = Object.assign({}, data);
        });

        describe('name is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.name = '';

                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('shortname is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.shortName = undefined;

                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('name / shortname are specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: endPoint, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    institutionId = responseBox.body.data.id;//set the test institution-id
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a success message', () => expect(responseBox.body.data.message).toBeDefined());
            it('should return the same name', () => expect(testData.name === responseBox.body.data.name).toBeTruthy());
            it('should return the same short-name', () => expect(testData.shortName === responseBox.body.data.short_name).toBeTruthy());
            it('should return the institution\'s id', () => expect(responseBox.body.data.id).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.created_at).toBeDefined());
        });
    });

    describe('GET /institutions/:institutionId', () => {
        describe('invalid institution-id is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/0`, ...options, json: true }, (error, response, body) => {
                    responseBox = { response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('valid institution-id is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/${institutionId}`, ...options, json: true }, (error, response, body) => {
                    responseBox = { response, body };
                    done();
                });
            });

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the institution\'s name', () => expect(responseBox.body.data.name).toBeDefined());
            it('should return the institution\'s sections', () => expect(responseBox.body.data.sections).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.created_at).toBeDefined());
        });
    });

    describe('POST /institutions/:institutionId/divisions', () => {
        let testData = {};

        beforeEach(() => {
            const data = { name: process.env.TEST_INSTITUTE_SECTION };
            testData = Object.assign({}, data);
        });

        describe('division-name is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.name = '';

                request.post({ url: `${endPoint}/${institutionId}/divisions`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('division-name is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: `${endPoint}/${institutionId}/divisions`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a success message', () => expect(responseBox.body.data.message).toBeDefined());
            it('should return the same name', () => expect(testData.name === responseBox.body.data.name).toBeTruthy());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });

    describe('DELETE /institutions/:institutionId', () => {
        describe('institution-id is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.delete({ url: `${endPoint}/${institutionId}`, ...options, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a success message', () => expect(responseBox.body.data.message).toBeDefined());
        });
    });
});
