const express = require('express')
const cors = require('cors')
const app = express();

require('./Routes/index')(app);

const corsOptions ={
    origin: true, 
    methods: ['GET', 'PUT', 'POST'],
    credentials:true,            //access-control-allow-credentials:true
    optionSuccessStatus:200
}
app.use(cors(corsOptions));
app.use(express.json());
app.listen(3333);
