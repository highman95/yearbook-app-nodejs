const { dbEntities } = require('../utils/helper')
const { BadRequestError, ConflictError, DatabaseError } = require('../utils/http-errors')

module.exports = {
    async addOne(name, divisionId, moderatorId) {
        if (!!await this.findByName(divisionId, name)) throw new ConflictError('The sub-division already exists')

        try {
            const result = await db.query(`INSERT INTO ${dbEntities.sub_divisions} (name, division_id, moderator_id) VALUES ($1, $2, $3) RETURNING id, name`, [name, divisionId, moderatorId])
            return (result.rowCount === 0) ? null : result.rows[0]
        } catch (e) {
            console.error('[Sub-Div.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The sub-division details could not be saved')
        }
    },

    fetchAll: async (divisionId) => {
        if (!divisionId) throw new BadRequestError('The division-id is missing')

        const result = await db.query(`SELECT id, name FROM ${dbEntities.sub_divisions} WHERE division_id = $1`, [divisionId])
        return result.rows
    },

    findByName: async (divisionId, name) => {
        if (!divisionId) throw new BadRequestError("The division-id is missing")
        if (!name) throw new BadRequestError("The sub-division's name is missing")

        const result = await db.query(`SELECT id, name, created_at FROM ${dbEntities.sub_divisions} WHERE division_id = $1 AND LOWER(name) = $2`, [divisionId, name.toLowerCase()])
        return (result.rowCount === 0) ? null : result.rows[0]
    },

    find: async (id) => {
        if (!id) throw new BadRequestError("The sub-division's unique-id is missing!")

        const result = await db.query(`SELECT id, name, created_at FROM ${dbEntities.sub_divisions} WHERE id = $1`, [id])
        return (result.rowCount === 0) ? null : result.rows[0]
    }
}
