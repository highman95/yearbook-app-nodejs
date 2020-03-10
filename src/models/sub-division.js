const divisionModel = require('./division')
const { BadRequestError, ConflictError, DatabaseError, NotFoundError } = require('../utils/http-errors')

module.exports = {
    async addOne(divisionName, name, moderatorId) {
        if (!divisionName) throw new BadRequestError('The name of its division is missing')
        if (!name) throw new BadRequestError('The name of the sub-division is missing')

        const division = await divisionModel.findByName(divisionName)
        if (!division) throw new NotFoundError('The division does not exist')

        if (!!await this.findByName(name)) throw new ConflictError('The sub-division already exists')

        let subDivision = {};
        try {
            const result = await db.query('INSERT INTO sub_divisions (name, division_id, moderator_id) VALUES ($1, $2, $3) RETURNING id, name', [name, division.id, moderatorId]);
            subDivision = (result.rowCount === 0) ? null : result.rows[0];
        } catch (e) {
            console.error('[Sub-Div.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The sub-division details could not be saved')
        }

        return subDivision;
    },

    fetchAll: async (divisionId) => {
        if (!divisionId) throw new BadRequestError('The division-id is missing')

        const result = await db.query('SELECT id, name FROM sub_divisions WHERE division_id = $1', [divisionId])
        return result.rows
    },

    findByName: async (name) => {
        if (!name) throw new BadRequestError("The sub-division's name is missing");

        let subDivision = {};
        try {
            const result = await db.query('SELECT id, name FROM sub_divisions WHERE LOWER(name) = $1', [name.toLowerCase()]);
            subDivision = (result.rowCount === 0) ? null : result.rows[0];
        } catch (e) {
            throw new DatabaseError('The sub-division details could not be retrieved')
        }

        return subDivision;
    },

    find: async (id) => {
        if (!id) throw new BadRequestError("The sub-division's unique-id is missing!");

        const result = await db.query('SELECT id, name FROM sub_divisions WHERE id = $1', [id]);
        return (result.rowCount === 0) ? null : result.rows[0];
    }
}
