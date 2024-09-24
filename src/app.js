const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const { traceDeprecation } = require('process');

const app = express();
const upload=multer({dest:'uploads/'});
mongoose.connect('mongodb://127.0.0.1:27017/data999',{useNewUrlParser:true,useUnifiedTopology:true})
    .then(() => {
        console.log('connection success');
    })
    .catch((err) => {
        console.error('Error', err);
    })



const User=mongoose.model('User',{
    name:String, 
    email:String, 
    mobilenumber:Number, 
    from:String, 
    to:String, 
    fare:String

});


const dileep = mongoose.model('Use', {
    firstName: String,
    lastName: String,
    userName: String,
    password: String,


});



app.use(bodyParser.urlencoded({
    extended: true
}));

app.get('/signup', (req, res) => {
    res.sendFile(__dirname + '/signup.html')
})

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/login.html');
});

// app.get('/', (req, res) => {
//     res.sendFile(__dirname + '/orderr.html');
// });

app.use(bodyParser.urlencoded({
    extended:true
}))
// getting form
app.get('/submit',(req,res)=>{
res.sendFile(__dirname+'/orderr.html');
})

app.post('/submit',(req,res)=>{
    const{name,email,mobilenumber,from,to,fare}=req.body
    const user=new User({
        name,email,mobilenumber,from,to,fare
    });
    user.save().then(()=>{
        res.sendFile(__dirname+'/imagee.html');

    })
    .catch((err)=>{
        console.error('error giving in saving data',err);
        res.status(500).send('error saving user');
    });
});



app.post('/register', (req, res) => {
    const { firstName, lastName, userName, password } = req.body
    const user = new dileep({
        firstName, lastName, userName, password
    });
    user.save().then(() => {
        res.sendFile(__dirname + '/login.html');

    })
        .catch((err) => {
            console.error('error giving in saving data', err);
            res.status(500).send('error saving user');
        });
});




// login hare
app.post('/login', async (req, res) => {
    try {
        const { userName, password } = req.body;
        const user = await dileep.findOne({ userName});
        console.log(user)
        if (!user) {
            res.status(400).json({ error: 'invalid email' })
            // console.log("invalid email");
        }
        if (user.password != password) {
            res.status(400).json({ error: 'invalid password' })
            // console.log("invalid password");
        }
        // res.status(200).json({ message: 'login successfull' })
        res.sendFile(__dirname + '/orderr.html');
    }
    catch {
        res.status(200).json({ error: 'login faild' })
    }
})


app.use('/uploads',express.static(path.join(__dirname,'uploads')))
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running port ${PORT}`);
});


