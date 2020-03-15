const { dbEntities } = require('../utils/helper')
const { BadRequestError, DatabaseError, ConflictError } = require('../utils/http-errors')

module.exports = {
    async addOne(alumniId, tagNo, institutionId, divisionId, subDivisionId, admission_year, graduation_year) {
        if (!!await this.find(alumniId, institutionId)) throw new ConflictError('This profile already exists')
        if (!!await this.findByTagNo(tagNo, institutionId)) throw new ConflictError('This registration number already exists')

        try {
            const input = [alumniId, tagNo, institutionId, divisionId, subDivisionId, admission_year, graduation_year]
            const result = await db.query(`INSERT INTO ${dbEntities.alumnus_cards} (alumnus_id, tag_no, institution_id, division_id, sub_division_id, admission_year, graduation_year) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id, tag_no, created_at`, input)
            return (result.rowCount === 0) ? null : result.rows[0]
        } catch (e) {
            console.error('[Card] DB-Error: ', e.message || e.error.message)
            throw new DatabaseError('The attended institution could not be saved')
        }
    },

    findByTagNo: async (tagNo, institutionId) => {
        if (!tagNo) throw new BadRequestError('The registration-number is missing')
        if (!institutionId) throw new BadRequestError('The institution is missing')

        const result = await db.query(`SELECT id, alumnus_id, tag_no, created_at FROM ${dbEntities.alumnus_cards} WHERE tag_no = $1 AND institution_id = $2`, [tagNo, institutionId])
        return (result.rowCount === 0) ? null : result.rows[0]
    },

    find: async (alumniId, institutionId) => {
        if (!alumniId) throw new BadRequestError('The alumni information is missing')
        if (!institutionId) throw new BadRequestError('The institution is missing')

        const result = await db.query(`SELECT id, alumnus_id, tag_no, created_at FROM ${dbEntities.alumnus_cards} WHERE alumnus_id = $1 AND institution_id = $2`, [alumniId, institutionId])
        return (result.rowCount === 0) ? null : result.rows[0]
    }
}
