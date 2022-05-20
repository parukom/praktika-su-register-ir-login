import express from "express";

const main = express.Router();

main.get('/', (req, res) => {
    res.render('startPage', {
        page: 'startPage',
        css: 'startPage.css',
        js: 'startPage.js'
    })
})

export default main;