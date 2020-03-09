const { BadRequestError, ConflictError, DatabaseError } = require('../utils/http-errors')

module.exports = {
    async addOne(name, shortName, moderatorId) {
        if (!name || !shortName) throw new BadRequestError('The name or its acronym is missing')
        if (!!await this.findByName(name)) throw new ConflictError('The institution-name already exists')

        let institution = {};
        try {
            const result = await db.query('INSERT INTO institutions (name, short_name, moderator_id) VALUES ($1, $2, $3) RETURNING id, name, short_name', [name, shortName, moderatorId]);
            institution = (result.rowCount === 0) ? null : result.rows[0];
        } catch (e) {
            console.error('[Inst.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The institution details could not be saved')
        }

        return institution;
    },

    fetchAll: async () => {
        try {
            const result = await db.query('SELECT id, name FROM institutions');
            return (result.rowCount === 0) ? [] : result.rows;
        } catch (e) {
            console.error('[Inst.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The institutions could not be retrieved')
        }
    },

    findByName: async (name) => {
        if (!name) throw new BadRequestError("The institution's name is missing");

        let institution = {};
        try {
            const result = await db.query('SELECT * FROM institutions WHERE LOWER(name) = $1', [name.toLowerCase()]);
            institution = (result.rowCount === 0) ? null : result.rows[0];
        } catch (e) {
            console.error('[Inst.] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The institution details could not be retrieved')
        }

        return institution;
    },
}
