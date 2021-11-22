const express = require('express');
const path = require('path');
const app = express();
const methodOverride = require('method-override');

app.use(express.static('public'));

app.use(express.urlencoded({ extended: false }));
app.use(methodOverride('_method'));

const publicPath = path.resolve(__dirname, './public');
const session = require('express-session')

app.use(session({ secret: 'secreto' }))


app.use(express.static('public'));
app.set('view engine', 'ejs');
<<<<<<< HEAD
app.use(express.urlencoded({ extended: false }));
let mainController = require('./routers/main.js');
const cookieParser = require('cookie-parser');
=======
>>>>>>> f5f3b46d319a1bf38c4397c4298a6bb5ab12c7ac

// let mainController = require('./routers/main.js')



app.listen(3000, () => {
    console.log('Servidor corriendo en el puerto 3000 ')
})

const main = require('./routers/main');
const userRoutes = require('./routers/userRoutes');

app.use('/', main);
app.use('/', userRoutes);