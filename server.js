var cookieSession = require('cookie-session');
var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var path = require('path')
var port = 3000;

var storage = multer.diskStorage({
    destination: function(req, file, callback) {
        callback(null, './images')
    },
    filename: function(req, file, callback) {
        console.log(file)
        callback(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname))
    }
});

var upload = multer({ storage: storage })

var sql = {
    comments: require("./sql/comments"),
    photos: require("./sql/photos"),
    ratings: require("./sql/ratings"),
    users: require("./sql/users")
};

var app = express();

app.use(function(req, res, next) {
    //res.setHeader('Access-Control-Allow-Origin', 'http://192.168.0.205:8080');
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,accept,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

app.use(express.static('images'));

//Add post data to req.body
app.use(bodyParser.json());

app.use(function(req, res, next) {
    console.log(req.method + ', url: ' + req.url);
    next();
});
//Get cookies
app.use(cookieSession({
    name: 'session',
    keys: ['key1', 'key2']
}));

app.use(function(req, res, next) {
    req.session.id = (req.session.id || 0);
    next();
});

//Comments
app.post('/addComment', function(req, res, next) {
    sql.comments.addComment(req.body.postId, req.session.id, req.body.text)
        .then((id) => {
            res.send(id);
            res.end();
        });
});

app.post('/deleteCommentById', function(req, res, next) {
    console.log(req.body);
    sql.comments.deleteCommentById(req.body.id)
        .then(() => {
            res.send();
            res.end();
        });
});

app.post('/changeComment', function(req, res, next) {
    sql.comments.changeComment(req.body.id, req.body.text)
        .then(() => {
            res.send();
            res.end();
        });
});

app.get('/getCommentsByPhotoId/:photoId', function(req, res, next) {
    sql.comments.getCommentsByPhotoId(req.params.photoId)
        .then(comments => {
            res.send(comments);
            res.end();
        });
});


//CurrentUser
app.get('/getCurrentUser', function(req, res, next) {
    console.log(req.session.id);
    if (req.session.id == 0) {
        res.send({
            id: 0,
            name: '',
            login: ''
        });
        res.end();
    } else {
        sql.users.getCurrentUser(req.session.id)
            .then(user => {
                res.send(user);
                res.end();
            });
    }
});

app.post('/logout', function(req, res, next) {
    console.log(req.session);
    req.session.id = 0;
    console.log(req.session.id);
    res.send({
        id: 0,
        name: '',
        login: ''
    });
    res.end();
});

//Photos
app.post('/addPhoto', upload.single('file'), function(req, res, next) {
    console.log(req.file)
    console.log(req.file.filename)
    sql.photos.addPhoto(req.session.id, 'http://localhost:3000/' + req.file.filename, req.body.title, req.body.description)
        .then(photo => {
            res.send(photo);
            res.end();
        });
});

app.post('/deletePhotoById', function(req, res, next) {
    sql.photos.deletePhotoById(req.body.photoId, req.session.id)
        .then(() => {
            res.send();
            res.end();
        });
});

app.post('/changePhoto', function(req, res, next) {
    sql.photos.changePhoto(req.body.id, req.body.title, req.body.description, req.session.id)
        .then(photo => {
            res.send(photo);
            res.end();
        });
});

app.get('/getUserPhotos', function(req, res, next) {
    sql.photos.getUserPhotos(req.session.id)
        .then(photos => {
            res.send(photos);
            res.end();
        });
});

app.get('/getAllPhotos', function(req, res, next) {
    sql.photos.getAllPhotos(req.session.id)
        .then(photos => {
            res.send(photos);
            res.end();
        });
});

//Rating
app.post('/addRating', function(req, res, next) {
    sql.ratings.addRating(req.body.photoId, req.body.rating, req.session.id)
        .then(() => {
            res.send();
            res.end();
        });
});

//Users
app.get('/changeUser/:login/:name', function(req, res, next) {
    sql.users.checkLoginExistence(req.session.id, req.params.login)
        .then(loginExistence => {
            if (!loginExistence) {
                sql.users.changeUser(req.session.id, req.params.login, req.params.name)
                    .then(() => {
                        return sql.users.getCurrentUser(req.session.id);
                    })
                    .then(user => {
                        res.send(user);
                        res.end();
                    });
            } else {
                res.send(false);
                res.end();
            }
        });
});

app.get('/getUserById/:userId', function(req, res, next) {
    var thisIsCurrentUser = (req.session.id === req.body.userId);
    sql.users.getUserById(req.params.userId, thisIsCurrentUser)
        .then(user => {
            res.send(user);
            res.end();
        });
});

app.post('/login', function(req, res, next) {
    console.log(req.session.id);
    sql.users.login(req.body.login, req.body.password)
        .then(user => {
            if (user) {
                req.session.id = user.id;
                console.log(req.session.id);
            }
            res.send(user);
            res.end();
        });
});

app.post('/register', function(req, res, next) {
    sql.users.register(req.body.login, req.body.password, req.body.name)
        .then(registrationIsDone => {
            if (!registrationIsDone) {
                res.send(false);
                res.end();
            } else {
                sql.users.login(req.body.login, req.body.password)
                    .then(user => {
                        if (user) {
                            req.session.id = user.id;
                        }
                        res.send(user);
                        res.end();
                    });
            }
        });
});

app.listen(port, function() {
    console.log('App listening on port ' + port + '!');
});