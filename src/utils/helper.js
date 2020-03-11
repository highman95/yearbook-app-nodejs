const jwt = require('jsonwebtoken')
const { BadRequestError } = require('./http-errors')

module.exports = {
    generateToken: (payload) => jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h', subject: 'TeamWork-nodeJS' }),

    isValidEmail: (email) => /^([a-zA-Z0-9_\-]+)(\.)?([a-zA-Z0-9_\-]+)@([a-zA-Z]+)\.([a-zA-Z]{2,})$/.test(email),

    validateParameters: (inputParams, paramsToVerify) => {
        Object.entries(inputParams).forEach(([key, value]) => {
            if (!paramsToVerify.includes(key)) throw new BadRequestError(`Invalid Parameter - ${key} - supplied`)

            // console.log(`key= ${key} --- value= ${value} --- typeof= ${typeof value} --- !value= ${!value} --- !!value= ${!!value} --- !!!value= ${!!!value}`)
            if (!value || value.trim() === '') throw new BadRequestError(`The ${key} is missing`)
        });
    },

    dbEntities: { institutions: 'institutions', divisions: 'divisions', sub_divisions: 'sub_divisions' },

    findByName: async (table, name) => {
        if (!table) throw new BadRequestError('The entity-name is missing')
        if (!name) throw new BadRequestError('The name is missing')

        const result = await db.query(`SELECT id, name, created_at FROM ${table} WHERE LOWER(name) = $1`, [name.toLowerCase()])
        return (result.rowCount === 0) ? null : result.rows[0];
    }
}
