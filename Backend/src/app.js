 const express = require('express');
const cookieParser = require('cookie-parser');
const adminRouter = require("./routes/admin.routes");
const authRouter = require('./routes/auth.routes');
const interviewRouter = require('./routes/interview.routes');
const cors = require('cors');
const app = express();

app.use(cors(
     {
        
    origin:"http://localhost:5173",
    credentials:true
 
     }
));

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRouter);
app.use('/api/interview', interviewRouter);
app.use('/api/admin', adminRouter);


module.exports = app;