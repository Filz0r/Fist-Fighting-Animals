function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return next()
    }
    req.flash('message', 'you need to login to access this page')
    res.redirect('/login')
  }
  
  function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
      return res.redirect('/')
    }
    next()
  }

module.exports = {
    checkAuthenticated,
    checkNotAuthenticated
}