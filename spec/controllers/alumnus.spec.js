require('dotenv').config();

const fs = require('fs');
const request = require('request');
const jwt = require('jsonwebtoken');

describe('AlumnusController Test Suite', () => {
    let server;
    let endPoint;
    let options = {};
    let alumniId;

    beforeAll(() => {
        server = require('../../src/index');

        const { address, port } = server.address();
        const hostName = address === '::' ? `http://localhost:${port}` : '';
        endPoint = `${hostName}/api/v1/alumni`;

        const token = jwt.sign({ userId: 1 }, process.env.JWT_SECRET);
        options = { headers: { token } };
    });

    // afterAll((done) => server.close(done));

    describe('POST /alumni', () => {
        let testFormData = {};

        beforeEach(() => {
            let data = {
                title: 'Once upon a time in Tokyo',
                image: fs.createReadStream('public/images/sample.gif')
            }

            testFormData = Object.assign({}, data);
        });

        describe('title is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.title = '';

                request.post({ url: endPoint, ...options, formData: testFormData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('image is not specified/uploaded', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.image = '';

                request.post({ url: endPoint, ...options, formData: testFormData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('non-GIF image is uploaded', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.image = fs.createReadStream('public/images/sample.jpg');

                request.post({ url: endPoint, ...options, formData: testFormData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('a title and GIF image are specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: endPoint, ...options, formData: testFormData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    alumniId = responseBox.body.data.alumniId;
                    done();
                });
            }, 15000);

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a success message', () => expect(responseBox.body.data.message).toBeDefined());
            it('should return the same title', () => expect(testFormData.title === responseBox.body.data.title).toBeTruthy());
            it('should return the gif\'s id', () => expect(responseBox.body.data.alumniId).toBeDefined());
            it('should return the gif post\'s imageUrl', () => expect(responseBox.body.data.imageUrl).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });

    describe('GET /alumni/:alumniId', () => {
        describe('invalid alumniId is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/0`, ...options, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('valid alumniId is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.get({ url: `${endPoint}/${alumniId}`, ...options, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 200', () => expect(responseBox.response.statusCode).toBe(200));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return the gif post\'s title', () => expect(responseBox.body.data.title).toBeDefined());
            it('should return the gif post\'s imageUrl', () => expect(responseBox.body.data.url).toBeDefined());
            it('should return the gif post\'s comments', () => expect(responseBox.body.data.comments).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });

    describe('POST /alumni/cards', () => {
        let testData = {};

        beforeEach(() => {
            const data = { institutionName: process.env.TEST_INSTITUTE, divisionName: '', subDivisionName: '' };
            testData = Object.assign({}, data);
        });

        describe('card-institution is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.institutionName = '';

                request.post({ url: `${endPoint}/cards`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('invalid institution is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.institutionName = 'xyz';

                request.post({ url: `${endPoint}/cards`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('invalid division is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.divisionName = 'xyz';

                request.post({ url: `${endPoint}/cards`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('invalid sub-division is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testData.subDivisionname = 'xyz';

                request.post({ url: `${endPoint}/cards`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 404', () => expect(responseBox.response.statusCode).toBe(404));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('valid parameters are specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.post({ url: `${endPoint}/${alumniId}/comment`, ...options, form: testData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a success message', () => expect(responseBox.body.data.message).toBeDefined());
            it('should return the same comment', () => expect(testData.comment === responseBox.body.data.comment).toBeTruthy());
            it('should return the gif post\'s title', () => expect(responseBox.body.data.gifTitle).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.createdOn).toBeDefined());
        });
    });

    describe('PATCH /alumni/profile-photos', () => {
        let testFormData = {};

        beforeEach(() => {
            testFormData = Object.assign({}, { photo: fs.createReadStream('public/images/sample.jpg') });
        });

        describe('jpeg / png image is not specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                testFormData.photo = fs.createReadStream('public/images/sample.gif');

                request.patch({ url: `${endPoint}/profile-photos`, ...options, form: testFormData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 400', () => expect(responseBox.response.statusCode).toBe(400));
            it('should return error status', () => expect(responseBox.body.status).toBe('error'));
            it('should return a relevant error message', () => expect(responseBox.body.error).toBeDefined());
        });

        describe('proper jpeg / png image is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.patch({ url: `${endPoint}/profile-photos`, ...options, form: testFormData, json: true }, (error, response, body) => {
                    responseBox = { error, response, body };
                    done();
                });
            });

            it('should return statusCode 201', () => expect(responseBox.response.statusCode).toBe(201));
            it('should return success status', () => expect(responseBox.body.status).toBe('success'));
            it('should return a success message', () => expect(responseBox.body.data.message).toBeDefined());
            it('should return the profile-photo\'s url', () => expect(responseBox.body.data.image_url).toBeDefined());
            it('should return the time-created', () => expect(responseBox.body.data.created_at).toBeDefined());
        });
    });

    describe('DELETE /alumni/:alumniId', () => {
        describe('GIF id is specified', () => {
            let responseBox = {};

            beforeAll((done) => {
                request.delete({ url: `${endPoint}/${alumniId}`, ...options, json: true }, (error, response, body) => {
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
