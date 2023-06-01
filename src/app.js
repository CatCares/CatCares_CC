const express = require('express');
const connectDB = require('./db');

const bodyParser = require('body-parser');

const routesKucing = require('../routes/routesKucing')
const routesUser = require('../routes/routesUser');
const routesDokter = require('../routes/routesDokter');
const routesArtikel = require('../routes/routesArtikel');
const routesAuth = require('../routes/routesAuth');

const app = express();

// Menghubungkan dengan Database
connectDB();

app.use(bodyParser.json());
app.use('/kucing', routesKucing);
app.use('/user', routesUser);
app.use('/dokter', routesDokter);
app.use('/artikel', routesArtikel);
app.use('/auth', routesAuth);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});