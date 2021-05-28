require('dotenv').config()
const express = require('express')
const app = express();
const http = require("http");
const mongoose = require('mongoose')
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const Pusher = require("pusher");
var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json())


// app.use(bodyParser.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 }))

app.set('view engine', 'hjs');
// const server = http.createServer(app);
const server = require('http').Server(app);
const socket = require("socket.io");
const { dns } = require('googleapis/build/src/apis/dns');
const { update } = require('./models/candidate.model.js');
const io = require('socket.io')(server);

const pusher = new Pusher({
    appId: "1208509",
    key: "839f2da51d1835f60ca6",
    secret: "de9d83328444b57dfdef",
    cluster: "eu",
    useTLS: true
});

// const io = socket(server)

// const users = [];
app.use(express.json())
app.use(cors())
app.use(cookieParser())
app.use(fileUpload({
    useTempFiles: true
}))

//connect to mongoDb
const URL =  process.env.MONGODB_URL
// mongoose.connect(URL, {
//     useCreateIndex: true,
//     useFindAndModify: false, //to avoid depreciation error
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
// }, err => {
//     if (err) throw err;
//     console.log("Connected to Mongodb");
// })
mongoose
     .connect( URL, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true, useFindAndModify: false, })
     .then(() => {
        console.log( 'Database Connected' )
        
    }).catch(err => console.log( err ));

//pusher
const db = mongoose.connection;
db.once("open", ()=>{
    console.log("db connected");
   
    var options = { fullDocument: 'updateLookup' };
    db.collection('users').watch(options).on('change', change => 
    {            
        if(change.operationType === 'update'){
            const changeDetails = change.fullDocument;
            // console.log("full document : ", changeDetails);
            // console.log("full document id : ", changeDetails._id);
            pusher.trigger("users", "updated", {
                userId : changeDetails._id,
                candidate_notifications : changeDetails.candidate_notifications,
                interviewer_notifications: changeDetails. interviewer_notifications
            });
        }else{
            console.log("Error Triggering Pusher");
        }
    });

});


// Routes


app.use('/user', require('./routes/userRouter.js'))
app.use('/api', require('./routes/upload'))
app.use("/api/test", require("./routes/test"));



//call code
const users = {};
console.log("users are :", users)

io.on('connection', socket => {
    // console.log("success                 heyyy,", socket.id)
    if (!users[socket.id]) {
        users[socket.id] = socket.id;
        
        // users[socket.id] = users;
        console.log("users are now",users)
    }
    
    socket.emit("yourID", socket.id);
    io.sockets.emit("allUsers", users);
    socket.on('disconnect', () => {
        delete users[socket.id];
    })

    socket.on("callUser", (data) => {
        io.to(data.userToCall).emit('hey', {signal: data.signalData, from: data.from});
    })

    socket.on("acceptCall", (data) => {
        io.to(data.to).emit('callAccepted', data.signal);
    })

    socket.on('message', message =>{
        io.emit('createMessage', message)
    })

    // console.log("users = " , users)
});


const PORT = process.env.PORT || 5000
// app.listen(PORT, ()=>{
//     console.log("Server is running on PORT", PORT);
// })
server.listen(PORT, () =>{
     console.log("Server is running on PORT", PORT)
})

