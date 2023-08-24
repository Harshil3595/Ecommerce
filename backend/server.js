const app=require('./app');
const dotenv=require('dotenv');
const connectDatabase=require('./config/db');

//handling incaught exception
process.on("uncaughtException",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to uncaught error");
    server.close(()=>{
        process.exit(1);
    });

})

//config
dotenv.config({path:"backend/config/config.env"});

//connect database
connectDatabase();


const server=app.listen(process.env.PORT,()=>{
    console.log(`Server is working on port ${process.env.PORT}`);
});

//Unhandled Promise Rejection
process.on("unhandledRejection",(err)=>{
    console.log(`Error : ${err.message}`);
    console.log("Shutting down the server due to unhandle promise rejection");
    server.close(()=>{
        process.exit(1);
    });

})