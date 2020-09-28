require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const registerRouter = require('./routes/register')
const loginRouter = require('./routes/login')
const passport = require('passport')
const flash = require('connect-flash')
const session = require('express-session')
const expressLayouts = require('express-ejs-layouts')
require('./controllers/passport')(passport)

const app = express()
//checks for connection
mongoose.connect(process.env.DATABASE_PATH, { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true })
mongoose.connection.once('open', async () => {
    console.log('mongoDB connected successfully!')
}).on('error', (err) => {
    console.log(`there was an error: ${err}`)
});

app.use(expressLayouts);
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))
app.use(express.static(__dirname + '/public'));

// passport 
app.use(flash())
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
}))
app.use(passport.initialize())
app.use(passport.session())

//global error variables
app.use( (req, res, next) => {
    res.locals.messages = req.flash('message')
    res.locals.error = req.flash('error')
    res.locals.changes = req.flash('changes')
    res.locals.paths = req.flash('path')
    next()
})

// routes 
app.use('/', require('./routes/index'))
app.use('/login', loginRouter)
app.use('/register', registerRouter)
app.use('/admin', require('./routes/admin'))
app.use('/account', require('./routes/users/account'))
app.use('/fight', require('./routes/users/fight'))
app.use('/user', require('./routes/users/user'))
app.use('/delete', require('./routes/users/delete'))
app.use('/edit', require('./routes/users/edit'))

// logout
app.get('/logout', (req, res) => {
    req.logOut()
    req.flash('message', 'you are logged out!')
    res.redirect('/login')
})
// starts server
app.listen(3000, (err) => {
    if (err) {
        console.log(err)
    } else {
        console.log('connected!')
    }
})


