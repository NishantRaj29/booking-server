require("dotenv").config()
const express =require('express');
const app = express();
const connectDB =require("./utils/db");
const ticketRoutes = require('./routers/ticket-router');
const cors = require('cors');

const corsOption = {
    origin:"http://localhost:5173",
    methods:"POST,DELETE,PATCH,GET,PUT,HEAD",
    credentials:true,
}
app.use(cors(corsOption));

app.use(express.json());
app.get('/', (req, res) => {
    res.status(200).send('Hello World!');
})

app.use('/api/tickets', ticketRoutes);


const PORT=5001;

connectDB().then(()=>{
    app.listen(PORT,()=>{
        console.log(`Server is running on ${PORT}`)
    })
})

