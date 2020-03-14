const bcrypt = require('bcrypt')
const { dbEntities, validateParameters } = require('../utils/helper')
const { ConflictError, DatabaseError, NotAcceptableError } = require('../utils/http-errors')

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

        if (!!await this.findOneByEmail(email)) throw new ConflictError('E-mail address already exists')
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

        let result = {}
        try {
            const input = [firstName, lastName, birthDate, genderLcase, email, hashedPassword, address]
            result = await db.query(`INSERT INTO ${dbEntities.alumni} (first_name, last_name, birth_date, gender, email, passw0rd, address) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, first_name`, input)
            return (result.rowCount === 0) ? null : result.rows[0]
        } catch (e) {
            console.error('[Cand.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The alumni details could not be saved')
        }
    },

    findOneByEmail: async (email) => {
        if (!email) throw new BadRequestError('The e-mail address is missing')

        const result = await db.query(`SELECT * FROM ${dbEntities.alumni} WHERE email = $1`, [email])
        return (result.rowCount === 0) ? null : result.rows[0]
    },
}
