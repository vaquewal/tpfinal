var express = require('express');
var path = require('path');
var app = express();
app.listen(8080);
// app.listen(process.env.PORT);

app.use(express.static(path.join(__dirname, 'public')));

var fs = require('fs');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/images/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + '-' + file.originalname)
    }
});
var upload = multer({ storage: storage });

var path = require("path");
var mongoose = require('mongoose');
var Post = require('./schemas/post');

mongoose.connect('mongodb://fotolog:fotolog@ds163181.mlab.com:63181/fotolog');
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    console.log("DB connected!");
});

var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  next();
});

console.log('Up...',Date.now());

app.get('/post',function (req, res){
    Post.find({},function(err, posts) {
        if (err){
           res.send("ERROR:",err);
        }
        // res.send( 'images/' + 'a.jpeg' );
        res.json(posts);
        console.log("posts:", posts)
    });
    console.log('Entro por /, Time:',Date.now())
});

app.get('/', function(req, res){
    res.sendFile(path.join(__dirname, 'views/index.html'));    
})



const max = (a, b) => (a > b ? a : b);
const getNewID = list => list.reduce((maxID, x) => max(maxID, x.id), 0) + 1;
const getNewPostID = list => list.reduce((maxID, x) => max(maxID, getNewID(x.tasks)), 0);


app.post('/post', upload.single('avatar'), function (req, res, next) {
      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any

    var post = new Post({
                            title: req.body.title,
                            path: req.file.path,
                            votes: "0"
                        }
                );
    post.save(function(err) {
            if (err){
                res.send(err);
            }
            res.send(post);
        });
    // console.log("title:",req.body.title + " path:" ,req.file.path);
})


app.post('/post/:id/vote',function (req, res) {   
    Post.findById(req.params.id, function(err, post) {
        if (err){
           res.send("ERROR:",err);
        }
        // console.log("llego:",post);

        if ( post.votes ) {
            post.votes = Number(post.votes) + 1;
        } else {
            post.votes = "1";
        }

        post.save(function() {
            res.send(post);    
        })
    })
});







//