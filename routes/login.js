import express from 'express';
import connection from '../sql_connection.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import middleware from '../middlewareAuth.js'


const login = express.Router();
login.get('/', (req, res) => {
    res.render('login', {
        page: 'login',
        css: 'login.css'
    })
})

login.post('/', async (req, res) => {
    let log = req.body;
    try {
        const [data] = await connection.query(`
        SELECT * 
        FROM users
        WHERE nickname = ?
        `, [log.nickname]);
        if (data.length === 0) {
            return res.status(400).send({ err: `incorrect email or password 👎🏽` })
        }
        const isAuthed = bcrypt.compareSync(log.password, data[0].password)

        if (isAuthed) {
            const token = jwt.sign({ id: data[0].id, email: data[0].email }, process.env.JWT_SECRET, {
                expiresIn: '1d'
            })
            return res.cookie('token', token, {
                maxAge: 24 * 60 * 60 * 1000
            }).redirect('home')
        } else {
            return res.status(400).send(`wrong email or password`)
        }
    } catch (err) {
        return res.status(500).send(err)
    }
})






export default login