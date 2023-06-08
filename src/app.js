const express = require('express');
const connectDB = require('./db');
const morgan = require('morgan');
const cors = require('cors');

const routesKucing = require('../routes/routesKucing')
const routesUser = require('../routes/routesUser');
const routesDokter = require('../routes/routesDokter');
const routesArtikel = require('../routes/routesArtikel');
const routesAuth = require('../routes/routesAuth');
const routesPrediction = require('../routes/routesPrediction');

const Logger = require('../utils/logger')

const app = express();

const stream = {
  write: (message) => Logger.http(message),
};

const morganMiddleware = morgan(
  ":method :url :status :res[content-length] - :response-time ms",
  {stream}
)

// Menghubungkan dengan Database
connectDB();

app.use(cors());
app.use(express.json());
app.use(morganMiddleware);
app.use(
  express.urlencoded({
    limit: "100mb",
    extended: true,
    parameterLimit: 500000,
  })
);

app.use('/kucing', routesKucing);
app.use('/user', routesUser);
app.use('/dokter', routesDokter);
app.use('/artikel', routesArtikel);
app.use('/auth', routesAuth);
app.use('/prediction', routesPrediction);

const PORT = 3000;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});