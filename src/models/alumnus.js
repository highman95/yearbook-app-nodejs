const bcrypt = require('bcrypt')
const { dbEntities, validateParameters, isValidEmail } = require('../utils/helper')
const { BadRequestError, ConflictError, DatabaseError, NotAcceptableError, UnauthorizedError } = require('../utils/http-errors')

module.exports = {
    async addOne(firstName, lastName, birthDate, gender, email, password, address) {
        //#region parameter-validation
        // verify the submitted input parameters
        const params = ['firstName', 'lastName', 'birthDate', 'gender', 'email', 'password', 'address']
        const submittedInput = { firstName, lastName, birthDate, gender, email, password, address }
        validateParameters(submittedInput, params)

        const genderLcase = gender.toLowerCase();
        if (genderLcase !== 'male' && genderLcase !== 'female') throw new NotAcceptableError('The gender can only be male or female')

        // verify birth-date value i.e valid and not under-age

        if (!!await this.findByEmail(email)) throw new ConflictError('E-mail address already exists')
        //#endregion

        //#region encrypt the password and compute input parameters
        let hashedPassword
        try {
            hashedPassword = await bcrypt.hash(password, 10)
        } catch (e) {
            console.error(e.message || e.error.message)
            throw new Error('The password could not be encrypted')
        }
        //#endregion

        try {
            const input = [firstName, lastName, birthDate, genderLcase, email, hashedPassword, address]
            const result = await db.query(`INSERT INTO ${dbEntities.alumni} (first_name, last_name, birth_date, gender, email, passw0rd, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name`, input)
            return (result.rowCount === 0) ? null : result.rows[0]
        } catch (e) {
            console.error('[Cand.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The alumni details could not be saved')
        }
    },

    async verifyCredentials(email, password) {
        if (!password) throw new BadRequestError('The password is missing')

        try {
            const alumnus = await this.findByEmail(email)
            if (!alumnus) throw new Error('The e-mail address does not exist')

            const same = await bcrypt.compare(password, alumnus.passw0rd)
            if (!same) throw new Error('The password is incorrect')

            const { id, first_name, last_name } = alumnus
            return { id, first_name, last_name }
        } catch (e) {
            console.error('[Cand.] Auth-Error: ', e.message || e.error.message)
            throw new UnauthorizedError('Invalid username / password')
        }
    },

    findByEmail: async (email) => {
        if (!email) throw new BadRequestError('The e-mail address is missing')
        if (!isValidEmail(email)) throw new BadRequestError('The e-mail address format is invalid')

        const result = await db.query(`SELECT * FROM ${dbEntities.alumni} WHERE email = $1`, [email])
        return (result.rowCount === 0) ? null : result.rows[0]
    },
}
