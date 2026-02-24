const express = require("express");
const dotenv = require('dotenv');
const {ConnectDB} = require('./config/db.config');
const cors = require('cors');
dotenv.config();
const app = express();
const authRoute = require('./routes/auth.route');
const projectRoute = require('./routes/project.route');
const taskRoute = require('./routes/task.route');

//connect database
ConnectDB();

//Middleware
app.use(cors());
app.use(express.json());
app.use('/api/auth',authRoute);
app.use('/api/project',projectRoute);
app.use('/api/task',taskRoute);

//test route
app.get('/', (req,res)=>{
    res.json({
        message:"Sprintler is running :)"
    });
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, ()=>{
    console.log(`Server started at : http://localhost:${PORT}/`);
})





