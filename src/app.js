/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
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
const dns = require('dns')

dns.lookup('smtp.gmail.com', (err, address) => {
  console.log('LOG: ', err || address)
})

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
        const date = new Date(value)
        const datePart = date.toLocaleDateString('id-ID', {
          day: 'numeric',
          month: 'long',
          year: 'numeric',
          timeZone: 'Asia/Jakarta'
        })
        const timePart = date.toLocaleTimeString('id-ID', {
          hour: '2-digit',
          minute: '2-digit',
          hour12: false,
          timeZone: 'Asia/Jakarta'
        }).replace(/\./g, ':')

        return `${datePart}, ${timePart}`
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

      or(a, b) {
        return String(a || '') || String(b || '')
      },

      gte(a, b) {
        return a >= b
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
      },

      json(context) {
        return JSON.stringify(context)
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
app.use((err, req, res, next) => {
  if (err.status !== 404) {
    console.error('❌ SYSTEM ERROR:', err.message)
    if (process.env.NODE_ENV === 'development') {
      console.error(err.stack)
    }
  }

  res.status(err.status || 500)

  if (err.status === 404) {
    return res.render('errors/404', {
      title: 'Page Not Found',
      layout: 'public'
    })
  }

  return res.render('errors/500', {
    title: 'Internal Server Error',
    layout: 'public',
    error: process.env.NODE_ENV === 'development' ? err : {}
  })
})

module.exports = app