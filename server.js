const express = require('express');
const cors = require('cors');
const app = express();

const corsOptions = {
  Origin: '*',
  methods: ['GET', 'PUT', 'POST'],
  credentials: true, //access-control-allow-credentials:true
  optionSuccessStatus: 200,
};
app.use(express.json());
app.use(cors(corsOptions));
app.listen(3333);

require('./Routes/index')(app);
