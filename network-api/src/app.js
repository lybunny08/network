const express = require('express');
const bodyparser = require('body-parser');
const session = require('express-session');

const app = express();

app.use(bodyparser.urlencoded({extended:false}));
app.use(bodyparser.json());

app.use(session({
    secret:'abc',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.get('/',(_, res) =>{
    res.json({  message: 'welcom to network-api' });
});


module.exports = app;