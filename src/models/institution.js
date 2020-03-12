const { dbEntities, findByName } = require('../utils/helper')
const { BadRequestError, ConflictError, DatabaseError } = require('../utils/http-errors')

module.exports = {
    async addOne(name, shortName, moderatorId) {
        if (!name || !shortName) throw new BadRequestError('The name or its acronym is missing')
        if (!!await findByName(dbEntities.institutions, name)) throw new ConflictError('The institution-name already exists')

        try {
            const result = await db.query(`INSERT INTO ${dbEntities.institutions} (name, short_name, moderator_id) VALUES ($1, $2, $3) RETURNING id, name, short_name`, [name, shortName, moderatorId])
            return (result.rowCount === 0) ? null : result.rows[0]
        } catch (e) {
            console.error('[Inst.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The institution details could not be saved')
        }
    },

    fetchAll: async () => {
        const result = await db.query(`SELECT id, name, created_at FROM ${dbEntities.institutions}`);
        return result.rows;
    },

    find: async (id) => {
        if (!id) throw new BadRequestError("The institution's unique-id is missing")

        const result = await db.query(`SELECT id, name, created_at FROM ${dbEntities.institutions} WHERE id = $1`, [id])
        return (result.rowCount === 0) ? null : result.rows[0]
    }
}
