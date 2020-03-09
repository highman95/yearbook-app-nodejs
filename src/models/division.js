const institutionModel = require('./institution')
const subDivisionModel = require('./sub-division')
const { BadRequestError, ConflictError, DatabaseError, NotFoundError } = require('../utils/http-errors')

module.exports = {
    async addOne(institutionName, name, moderatorId) {
        if (!institutionName) throw new BadRequestError('The name of its institution is missing')
        if (!name) throw new BadRequestError('The name of the division is missing')

        const institution = await institutionModel.findByName(institutionName)
        if (!institution) throw new NotFoundError('The institution does not exist')

        if (!!await this.findByName(name)) throw new ConflictError('The division already exists')

        let division = {};
        try {
            const result = await db.query('INSERT INTO divisions (name, institution_id, moderator_id) VALUES ($1, $2, $3) RETURNING id, name', [name, institution.id, moderatorId]);
            division = (result.rowCount === 0) ? null : result.rows[0];
        } catch (e) {
            console.error('[Div.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The division details could not be saved')
        }

        return division;
    },

    fetchAll: async (institutionId) => {
        if (!institutionId) throw new BadRequestError('The institution-id is missing')

        try {
            const results = await db.query('SELECT id, name FROM divisions WHERE institution_id = $1', [institutionId])
            return results.rows
        } catch (e) {
            console.error('[Div.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The divisions could not be retrieved')
        }
    },

    findByName: async (name) => {
        if (!name) throw new BadRequestError("The division's name is missing");

        let division = {};
        try {
            const result = await db.query('SELECT id, name FROM divisions WHERE LOWER(name) = $1', [name.toLowerCase()]);
            division = (result.rowCount === 0) ? null : result.rows[0];
        } catch (e) {
            console.error('[Div.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The division details could not be retrieved')
        }

        return division;
    },

    find: async (id) => {
        if (!id) throw new BadRequestError("The division's unique-id is missing")

        const result = await db.query('SELECT id, name FROM divisions WHERE id = $1', [id])
        let division = (result.rowCount === 0) ? null : result.rows[0]

        if (!!division) {
            division.sub_divisions = await subDivisionModel.fetchAll(division.id)
        }

        return division
    }
}
