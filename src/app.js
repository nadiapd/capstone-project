require('dotenv').config()

const express = require('express')
const path = require('path')
const logger = require('morgan')
const session = require('express-session')
const createError = require('http-errors')
const cookieParser = require('cookie-parser')

const {
  engine
} = require('express-handlebars')

const routes = require('./routes')

const app = express()

// Handlebars Engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
    defaultLayout: 'main',
    layoutsDir: path.join(__dirname, 'views/layouts'),

    helpers: {
      formatDate(value) {
        if (!value) return '-'

        return new Date(value).toLocaleDateString('id-ID', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit'
        })
      },

      ifEquals(a, b, options) {
        return a == b
          ? options.fn(this)
          : options.inverse(this)
      },

      minus(a, b) {
        return a - b
      },

      lookup(obj, index) {
        return obj ? obj[index] : undefined
      },

      eq(a, b) {
        return String(a || '') === String(b || '')
      },
      
      isEven(idx) {
        return idx % 2 === 0
      },

      formatCurrency(amount) {
        if (amount === null || amount === undefined || amount === '') {
          return 'Rp0'
        }
  
        return new Intl.NumberFormat('id-ID', {
          style: 'currency',
          currency: 'IDR',
          minimumFractionDigits: 0,
          maximumFractionDigits: 0
        }).format(amount).replace(/\s/g, '')
      }
    }
  })
)

app.set('view engine', 'hbs')

app.set(
  'views',
  path.join(__dirname, 'views')
)

// Middleware
app.use(logger('dev'))

app.use(express.json())

app.use(
  express.urlencoded({
    extended: false
  })
)

app.use(cookieParser())

app.use(
  express.static(
    path.join(__dirname, 'public')
  )
)

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
  })
)

// Routes
app.use(routes)

// 404 Handler
app.use((req, res, next) => {
  next(createError(404))
})

// Error Handler
app.use((err, req, res) => {

  if (err.status === 404) {

    return res.status(404).render(
      'errors/404',
      {
        title: 'Page Not Found',
        layout: 'public'
      }
    )
  }

  return res.status(500).render(
    'errors/500',
    {
      title: 'Internal Server Error',
      layout: 'public'
    }
  )
})

module.exports = app