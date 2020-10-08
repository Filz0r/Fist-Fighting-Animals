const LocalStrategy = require('passport-local').Strategy
const User = require('../schemas/userSchema')
const bcrypt = require('bcrypt')
const { setEmailToLowerCase } = require('./utils')

function initialize(passport) {

  passport.use(new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
    User.findOne({ email: setEmailToLowerCase(email) }).then(async user => {
      if (!user) {
        return done(null, false, { message: 'No user with that email' })
      }
      try {
        if (await bcrypt.compare(password, user.password)) {
          return done(null, user)
        } else {
          return done(null, false, { message: 'Password incorrect' })
        }
      } catch (e) {
        return done(e)
      }
    })

  }))
  passport.serializeUser(function (user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
      done(err, user);
    });
  });
}

module.exports = initialize