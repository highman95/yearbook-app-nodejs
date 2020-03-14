const { dbEntities } = require('../utils/helper')
const { BadRequestError, ConflictError, DatabaseError } = require('../utils/http-errors')

module.exports = {
    async addOne(name, institutionId, moderatorId) {
        if (!name) throw new BadRequestError('The name of the division is missing')
        if (!institutionId) throw new BadRequestError('The institution-id is missing')

        if (!!await this.findByName(institutionId, name)) throw new ConflictError('The division already exists')

        try {
            const result = await db.query(`INSERT INTO ${dbEntities.divisions} (name, institution_id, moderator_id) VALUES ($1, $2, $3) RETURNING id, name`, [name, institutionId, moderatorId])
            return (result.rowCount === 0) ? null : result.rows[0]
        } catch (e) {
            console.error('[Div.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The division details could not be saved')
        }
    },

    fetchAll: async (institutionId) => {
        if (!institutionId) throw new BadRequestError('The institution-id is missing')

        const results = await db.query(`SELECT id, name FROM ${dbEntities.divisions} WHERE institution_id = $1`, [institutionId])
        return results.rows
    },

    findByName: async (institutionId, name) => {
        if (!institutionId) throw new BadRequestError("The institution-id is missing")
        if (!name) throw new BadRequestError("The division's name is missing")

        const result = await db.query(`SELECT id, name, created_at FROM ${dbEntities.divisions} WHERE institution_id = $1 AND LOWER(name) = $2`, [institutionId, name.toLowerCase()])
        return (result.rowCount === 0) ? null : result.rows[0]
    },

    find: async (id) => {
        if (!id) throw new BadRequestError("The division's unique-id is missing")

        const result = await db.query(`SELECT id, name, created_at FROM ${dbEntities.divisions} WHERE id = $1`, [id])
        return (result.rowCount === 0) ? null : result.rows[0]
    }
}
