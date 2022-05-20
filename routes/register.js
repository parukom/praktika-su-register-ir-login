import express from 'express';
import connection from '../sql_connection.js';
import Joi from 'joi';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// import middleware from '../middlewareAuth.js'


const register = express.Router();
const userSchema = Joi.object({
    email: Joi.string().trim().lowercase().required(),
    nickname: Joi.string().trim().lowercase().required(),
    password: Joi.string().required()
})

register.get('/', (req, res) => {
    res.render('register', {
        page: 'register',
        css: 'register.css'
    })
})

register.post('/', async (req, res) => {
    let reg = req.body;
    try {
        reg = await userSchema.validateAsync(reg)
    } catch (err) {
        return res.status(500).send({ err: `user email or nick is in use` })
    }
    try {
        const hashedPassword = bcrypt.hashSync(reg.password);
        const newUser = await connection.query(`
        INSERT INTO users (email, nickname, password, reg_timestamp)
        VALUES (?,?,?,?)
        `, [reg.email, reg.nickname, hashedPassword, new Date().toLocaleDateString('LT')])
        const token = jwt.sign({ id: newUser[0].insertId, email: reg.email }, process.env.JWT_SECRET)
        return res.cookie('token', token, {
            maxAge: 24 * 60 * 60 * 1000
        }).redirect('/')
    } catch (err) {
        console.log(err.sqlMessage);
        return res.status(500).send(err.sqlMessage)
    }

})



export default register;