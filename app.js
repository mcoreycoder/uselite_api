const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const cors = require('cors')
const fileUpload = require('express-fileupload')
const db = require('./db/mongoose')

//Set callback for Routes below
const indexRouter = require('./routes/index')
// const usersRouter = require('./routes/exampleUsers')
const usersRouter = require('./routes/users')
const productsRouter = require('./routes/products')
// const apiUsersRouter = require('./routes/api/apiUsers')

const app = express()
db.connect()
  .then(connection => {
    console.log("Connected to db")
    // view engine setup
    app.set('views', path.join(__dirname, 'views'))
    app.set('view engine', 'ejs')

    app.use(cors())
    app.use(logger('dev'))
    app.use(express.json())
    app.use(express.urlencoded({ extended: false }))
    app.use(cookieParser())
    app.use(fileUpload())
    app.use(express.static(path.join(__dirname, 'public')))

    // Routes
    app.use('/', indexRouter) // original boilerpate example
    // app.use('/users', usersRouter) // original boilerpate example
    // app.use('/api/users', apiUsersRouter) // class example
    app.use('/users', usersRouter)
    app.use('/products', productsRouter)

    // catch 404 and forward to error handler
    app.use(function (req, res, next) {
      next(createError(404))
    })

    // error handler
    app.use(function (err, req, res, next) {
      // set locals, only providing error in development
      res.locals.message = err.message
      res.locals.error = req.app.get('env') === 'development' ? err : {}

      // render the error page
      res.status(err.status || 500)
      res.render('error')
    });

    process.on('SIGINT', ()=>{
      db.close()
      process.exit()
    })

  })
  .catch(error => {
    console.log('connect error:', error)
  })

module.exports = app
