const path = require('path');
const express = require('express');
const session = require('express-session');
const exphbs = require('express-handlebars');
const routes = require('./controllers');
const helpers = require('./utils/helpers');
require('dotenv').config();

const sequelize = require('./config/connection');
const SequelizeStore = require('connect-session-sequelize')(session.Store);

const app = express();
const PORT = process.env.DB_PORT || 3001;

const hbs = exphbs.create({ defaultLayout: 'main', layoutsDir: path.join(__dirname, 'views', 'layouts'), helpers });

const sess = {
  secret: process.env.SESS_SECRET,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24, // 24 hours
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production', // secure cookies only in production
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict', // 'none' for cross-site in production
  },
  resave: false,
  saveUninitialized: true,
  store: new SequelizeStore({
    db: sequelize
  })
};


app.use(session(sess));

// Inform Express.js on which template engine to use
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.set('trust proxy', 1); // Trust first proxy (important for secure cookies)

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use(routes);

const syncOptions = process.env.NODE_ENV === 'production' ? { alter: true } : { force: false };

sequelize.sync(syncOptions).then(() => {
  app.listen(PORT, () => console.log("Now listening"));
});