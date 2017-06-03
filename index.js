var express = require('express');
var app = express();
app.listen(8080);
// app.listen(process.env.PORT);

app.use(express.static('images'));
var fs = require('fs');
var multer  = require('multer');
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'images/')
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

app.get('/',function (req, res){
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

const max = (a, b) => (a > b ? a : b);
const getNewID = list => list.reduce((maxID, x) => max(maxID, x.id), 0) + 1;
const getNewPostID = list => list.reduce((maxID, x) => max(maxID, getNewID(x.tasks)), 0);


app.post('/post', upload.single('avatar'), function (req, res, next) {
      // req.file is the `avatar` file
      // req.body will hold the text fields, if there were any

    var post = new Post({
                            title: req.body.title,
                            path: req.file.path
                        }
                );
    post.save(function(err) {
            if (err){
                res.send(err);
            }
            res.send(post);
        });
    console.log("title:",req.body.title + " path:" ,req.file.path);
})




















// app.get('/users',function (req, res){
//     Users.find({},function(err, users) {
//         if (err){
//            res.send("ERROR:",err);
//          }
//         res.json(users);
//         console.log("users:",users)
//     });
//     console.log('Entro por /, Time:',Date.now())
// });

// app.get('/users/:id',function (req, res){
//     Users.findOne({"id": Number(req.params.id)}, function(err, users) {
//         if (err){
//            res.send("ERROR:",err);
//          }
//         res.json(users);
//         console.log("user:",users)
//     })
// });

// app.post('/users',function (req, res) {
//     // console.log(req.body.id);
//     // console.log(req.body.nombre);
//     // console.log(req.body.lists);
    
//     var users = new Users();      // create a new instance of the lists model
//     users.id = Number(req.body.id);    // set the bears name (comes from the request)
//     users.nombre = req.body.nombre;
//     users.lists = req.body.lists;
//     // save the lists and check for errors
//     users.save(function(err) {
//         if (err){
//             res.send(err);
//         }
//         res.json({ message: 'User created!' });
//     });
// });


// app.post('/users/:id',function (req, res) {
//     // console.log(req.body.id);
//     // console.log(req.body.title);
//     // console.log(req.body.tasks);
    
//     var lista = {
//         id : Number(req.body.id),
//         title : req.body.title,
//         task: req.body.tasks
//     };

//     Users
//       .findOneAndUpdate({"id": Number(req.params.id)}, {$push : {"lists": lista} })
//       .then(res => res.send(res))
//       .catch(err => res.send(err));
// });


// // -------------------------------------------------



// app.delete("/task/:id",function (req, res){    
//     const id = parseInt(req.params.id, 10);
    
//     database.lists = database.lists.map(list => {
      
//       list.tasks = list.tasks.filter(task => task.id !== id);
//       return list;
//     });
    
//     saveDatabase();
//     console.log(`DELETE task ${id} deleted`);
//     res.send();
// });

// app.delete("/lists/:id",function (req, res){    
//     const eraseId = Number(req.params.id);
    
//     database.lists = database.lists.filter(list => list.id !== eraseId);
//     saveDatabase();
//     console.log(`DELETE list ${eraseId} deleted`);
//     res.send();
// });


// app.listen(8080);
// app.listen(8080);
// app.listen(process.env.PORT);






















// // ---------------------------------------------------------------------- //
// app.get('/', function (req, res) {
//   res.sendFile( __dirname +'/index.html');
// });

// app.get('/users', function (req, res) {
//   User.find({}, function (err, docs) {
//     res.send(docs);
//   });
// });

// // ---------------------------------------------------------------------- //
// app.get('/lists',function (req, res){
//     List.find()
//     .populate('tasks')
//     .exec(function (err, lists) {
//       if (err) return console.error(err);
//       console.log(lists);
//       res.send(lists);
//     });
// });

// app.get('/lists/:id',function (req, res){
//     List
//     .findOne({_id: req.params.id})
//     .populate('tasks')
//     .exec(function (err, list) {
//       if (err) return console.error(err);
//       console.log(list);
//       res.send(list)
//     });
// });

// app.post('/lists',function (req, res) {
//     var listDB = new List({ title: req.body.title, tasks: [] });
//     listDB.save(function (err, list) {
//       if (err) return console.error(err);
//         console.log("Lista creada!");
//         res.send(list._id.toString());
//     });
// });

// app.post('/lists/:id',function (req, res) {
//     List.findOne({_id: req.params.id}, function(err, list) {
//         var taskDB = new Task({title: req.body.title, completed: false});
//         taskDB.save(function (err, task) {
//           if (err) return console.error(err);
//             console.log("Task creada!");
//             list.tasks.push(task);
//             list.save(function(err, lst) {
//                 if (err) return console.error(err);
//                 console.log("List save!");
//                 res.send(lst.toString());
//             });
//         });
//     });
// });

// app.put("/task/:id",function (req, res){
//     Task.findOne({ _id: req.params.id }, function(err, task) {
//         task.title = (req.body.title === undefined) ? task.title : req.body.title
//         task.completed = (req.body.completed === undefined) ? task.completed : req.body.completed

//         task.save(function(err, task) {
//             console.log(`task ${req.params.id} modified`);
//             res.send();
//         });
//     });
// });

// app.delete("/task/:id",function (req, res){
//     Task.remove({ _id: req.params.id }, function (err) {
//       if (err) return console.log(err);
//         console.log(`task ${req.params.id} deleted`);
//         res.send();
//     });
// });


// app.delete("/lists/:id",function (req, res){
//     List.remove({ _id: req.params.id }, function (err) {
//       if (err) return console.log(err);
//         console.log(`list ${req.params.id} deleted`);
//         res.send();
//     });
// });

// ---------------------------------------------------------------------- //





//