const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');

const userRoutes = require('./routes/user');
const postRoutes = require('./routes/post');
const chatRoutes = require('./routes/chat');

const app = express();

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:false}));
app.use('/files', express.static(path.join(__dirname, '../files')));

mongoose.connect('mongodb://localhost:27017/network', { serverSelectionTimeoutMS: 5000 })
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));


app.use('/api/auth', userRoutes);
app.use('/api/post', postRoutes);
app.use('/api/chat', chatRoutes);

app.get('/api',(_, res) =>{
    res.json({  message: 'welcom to network-api' });
});

module.exports = app;