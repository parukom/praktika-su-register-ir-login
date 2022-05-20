import 'dotenv/config'
import express from "express";
import cors from 'cors';
import path from 'path';
import cookieParser from 'cookie-parser';

import startPage from './routes/startPage.js';
import register from './routes/register.js';
import login from './routes/login.js';

const app = express();
const PORT = process.env.PORT;
const corsOptions = {
    origin: `http://localhost:${PORT}`,
    optionsSuccessStatus: 200
};

app.set('view engine', 'ejs');
app.set('views', './views');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));
app.use(express.static(path.resolve('public')));
app.use(cookieParser());

app.use('/', startPage);
app.use('/register', register);
app.use('/login', login);


app.listen(PORT, console.log(`serveris vaziuoja ant ${PORT} porto`));