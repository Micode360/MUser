const express = require('express');
const app = express();
const cors = require('cors');
const session = require("express-session");
const mongoose = require("mongoose");
const UserModel = require("./models/user");
const bcrypt = require('bcryptjs');
const moment = require('moment');
const { body, validationResult } = require('express-validator');
const connectMongodbSession = require("connect-mongodb-session")(session);


//Middleware
app.use(cors());
app.use(express.json());
require('dotenv').config();
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));


mongoose.connect(process.env.MONGO_URI, {
    useNewURLParser: true,
    useUnifiedTopology: true
}).then(res => console.log("MongoDB is Alive...."))


const store = new connectMongodbSession({
    uri: process.env.MONGO_URI,
    collection: 'user'
})


app.use(session({
    secret: 'will put cookie here soon',
    resave: false,
    saveUninitialized: false,
    store: store
}))


app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/views'));


const confirmAuth = (req, res, next) => {
    if (req.session.setAuth)next();
    else res.redirect('/signin');
}





/*Get Routes*/
app.get('/', confirmAuth, (req, res) => {
    UserModel.find()
    .then((data) => {

       const mappedData = data.map(user => {
            const dataFormat = {
                name: user.name,
                email: user.email,
                createdAt:  moment(user.createdAt).fromNow()
            }
            return dataFormat;
        })

        res.render("index", {name: 'User', users: mappedData});
    });
    
})


app.get('/signup', (req, res) => {
    res.render("signup", { error: '' });
})

app.get('/signin', (req, res) => {
    res.render("signin");
})



/*Post Routes*/
app.post("/signup",
    async (req, res) => {
        const { name, email, password } = req.body;

        const userModel = new UserModel({
            name,
            email,
            password
        });

        const crypted = await bcrypt.hash(userModel.password, 15);
        userModel.password = crypted;

        userModel.save()
            .then(() => res.redirect('/signin'))
            .catch(err => res.status(500).json({ error: err }))
    })



app.post("/signin", async (req, res) => {
    const { email, password } = req.body;


    UserModel.findOne({ email: email }, async (err, user) => {

        if (err) return err;
        if (!user) {
            res.status(401).json({ errormessage: "Incorrect Email" });
        }

        const passwordCompare = await bcrypt.compare(password, user.password);

        if (passwordCompare === false) {
            res.status(401).json({ errormessage: "Incorrect Password" });
        } else {
            req.session.setAuth = true;
            user.lastLogin = new Date();
            res.redirect('/')
        }

    });

})


app.post("/logout", (req, res) => {
    req.session.destroy((err) => {
        if (err) throw err;
        res.redirect("/");
    })
})



const port = process.env.PORT || 8000;
app.listen(port, () => console.log(`your port is running at ${port}`))