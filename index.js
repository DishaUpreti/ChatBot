//importing the required modules
//it is a driver for connecting with mongodb
const mongoose = require('mongoose');
//importing express
const express = require("express");
//for creating a http server
const http = require('http');
//it is for seeing the path of files
const path = require("path");
//it is an library for ai 
const ai = require("clever-bot-api");
//importing schemas from models
const { questions, admin} = require('./models/schema');
//database connection file
const {db} = require('./database/db_connection');
//it is used for creating an instance of express app
const app = express();
 
//creating the server
const server = http.createServer(app);
//urlencoded is used for using non ascii char in url
app.use(express.urlencoded(true))


//for serving static files
app.use(express.static(__dirname + '/static/'));  
//setting template engine  
app.set('view engine', 'pug')
//connecting views filr
app.set('views', path.join(__dirname, 'views'))

//get requests
app.get('/', (req, res) => {
    //res.render is use for rendering pug or template files
    res.render('index');
});
app.get('/login', (req, res) => {
    res.render('login');
});

app.post('/addDetails', (req, res) => {
    //getting data from the question adding page
    console.log(req.body)
    var myData = new questions(req.body);
    //saving to database
    myData.save().then(() => {
        res.status(200).render('addDetails');
    }).catch(() => {
        res.status(200).render('404');
    });
});

app.post('/', (req, res) => {
     //getting data from the question adding page
    let text = (req.body.query).toUpperCase();
    //question asked by the user
    console.log(text);
    questions.findOne({
        Question: {
            $regex : text,
            $options : 'i'
        }
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data) {
                let Question_from_table = data.Question;
                let Answer_from_table = data.Answer;
                console.log("Question is " +Question_from_table);
                console.log("Answer is " + Answer_from_table);
                res.render('index', {
                    question: Question_from_table,
                    answer: Answer_from_table
                });
                
            }
            else
            {
                ai(text).then(data => {
                    res.render('index',{
                        data:data,
                        question:text
                    })
                })
            }
        }
    });

})
app.post('/login', (req, res) => {
    let username = (req.body.username).toUpperCase();
    let password = (req.body.password).toUpperCase();
    console.log(username);
    console.log(password);
    admin.findOne({
        AdminName: username,
        Password: password
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data) {
                res.status(200).render('addDetails'); 
            } else {
                console.log(err);
                res.status(200).render('login');
            }
        }
    });
})

const PORT = process.env.PORT || 9000;
     
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));