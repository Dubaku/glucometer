var bodyParser = require('body-parser'); // get body-parser
var User = require('../models/user');
var jwt = require('jsonwebtoken');
var config = require('../../config');
var validator = require('validator');

var Measure = require('../models/measure');

// super secret for creating tokens
var superSecret = config.secret;

module.exports = function(app, express) {

    var apiRouter = express.Router();

    // route to authenticate a user (POST http://localhost:8080/api/authenticate)
    apiRouter.post('/authenticate', function(req, res) {

        // find the user
        User.findOne({
            username: req.body.username
        }).select('_id name username admin password').exec(function(err, user) {

            console.log("\nAuthentication user:\n "+user+"\n\n"+user.name + "\n"+user.admin + "\n"+user._id + "\n");
            
            if (err) throw err;

            // no user with that username was found
            if (!user) {
                res.json({
                    success: false,
                    message: 'Authentication failed. User not found.'
                });
            } else if (user) {

                // check if password matches
                var validPassword = user.comparePassword(req.body.password);
                if (!validPassword) {
                    res.json({
                        success: false,
                        message: 'Authentication failed. Wrong password.'
                    });
                } else {

                    // if user is found and password is right
                    // create a token
                    var token = jwt.sign({
                        _id: user._id,
                        username: user.username,
                        name: user.name,
                        admin: true
                    }, superSecret, {
                        expiresInMinutes: 1440 // expires in 24 hours
                    });

                    // return the information including token as JSON
                    res.json({
                        success: true,
                        message: 'Enjoy your token!',
                        token: token
                    });
                }

            }

        });
});

    // route middleware to verify a token
    apiRouter.use(function(req, res, next) {
        // do logging
        console.log('Somebody just came to our app!');

        // check header or url parameters or post parameters for token
        var token = req.body.token || req.query.token || req.headers['x-access-token'];

        // decode token
        if (token) {

            // verifies secret and checks exp
            jwt.verify(token, superSecret, function(err, decoded) {

                if (err) {
                    res.status(403).send({
                        success: false,
                        message: 'Failed to authenticate token.'
                    });
                } else {
                    // if everything is good, save to request for use in other routes
                    req.decoded = decoded;

                    next(); // make sure we go to the next routes and don't stop here
                }
            });

        } else {

            // if there is no token
            // return an HTTP response of 403 (access forbidden) and an error message
            res.status(403).send({
                success: false,
                message: 'No token provided.'
            });

        }
    });


    // test route to make sure everything is working 
    // accessed at GET http://localhost:8080/api
    apiRouter.get('/', function(req, res) {
        res.json({
            message: 'hooray! welcome to our api!'
        });
    });


    // on routes that end in /users
    // ----------------------------------------------------
    apiRouter.route('/users')

    // create a user (accessed at POST http://localhost:8080/users)
    .post(function(req, res) {
        var errormsg = "";
        var user = new User(); // create a new instance of the User model

        user.name = req.body.name; // set the users name (comes from the request)
        user.username = req.body.username; // set the users username (comes from the request)
        user.email = req.body.email;
        user.adress = req.body.adress;
        user.country = req.body.country;
        user.city = req.body.city;
        user.birthdate = req.body.birthdate;
        user.weight = req.body.weight;
        user.height = req.body.height;
        user.password = req.body.password; // set the users password (comes from the request)

        if (!user.username)
            errormsg = "User Invalid\n";

        if (!validator.isEmail(user.email))
            errormsg += "Email Invalid\n";

        if (user.weight && !isNumeric(user.weight))
            errormsg += "Email Invalid\n";

        if (user.height && !isNumeric(user.height))
            errormsg += "Email Invalid\n";

        if (errormsg) {
            console.log(json({
                success: false,
                message: errormsg,
                user: user
            }))
            return res.json({
                success: false,
                message: errormsg,
                user: user
            });
        } else {
            user.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({
                            success: false,
                            message: 'A user with that username already exists. '
                        });
                    else
                        return res.send(err);
                }

                // return a message
                res.json({
                    message: 'User Successfully Created!'
                });
            });
        }

    })
    // get all the users (accessed at GET http://localhost:8080/api/users)
    .get(function(req, res) {

        User.find({}, function(err, users) {
            if (err) res.send(err);

            // return the users
            res.json(users);
        });
    });


    apiRouter.route('/users/name/:user_name')
    // get the user id with that name
    .get(function(req, res) {
       User.find({ username: req.params.user_name } , function(err, user) {
        if (err) res.send(err);
            // return that user
            res.json(user);
        });
   });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/users/:user_id')
    // get the user with that id
    .get(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {
            if (err) res.send(err);
            // return that user
            res.json(user);
        });
    })
    // update the user with this id
    .put(function(req, res) {
        User.findById(req.params.user_id, function(err, user) {

            if (err) res.send(err);

            // set the new user information if it exists in the request
            if (req.body.name) user.name = req.body.name;
            if (req.body.username) user.username = req.body.username;
            if (req.body.password) user.password = req.body.password;

            // save the user
            user.save(function(err) {
                if (err) res.send(err);

                // return a message
                res.json({
                    message: 'User Successfully Updated!'
                });
            });

        });
    })
    // delete the user with this id
    .delete(function(req, res) {
        User.remove({
            _id: req.params.user_id
        }, function(err, user) {
            if (err) res.send(err);

            res.json({
                message: 'User Successfully Deleted'
            });
        });
    });



    // on routes that end in /statistics
    // ----------------------------------------------------
    apiRouter.route('/measures')

    // create a measure
    .post(function(req, res) {
        var errormsg    = "";
        var measure     = new Measure(); // create a new instance of the measure model
        measure.user_id = req.body.user_id;
        measure.value   = req.body.value;
        measure.meal    = req.body.meal;
        measure.note    = req.body.note;
        measure.date    = req.body.date;

        console.log(measure);
        measure.save(function(err) {
                if (err) {
                    // duplicate entry
                    if (err.code == 11000)
                        return res.json({
                            success: false,
                            message: 'A measure with that id already exists.'
                        });
                    else
                        return res.send(err);
                }

                // return a message
                res.json({
                    message: 'Measure Successfully created!'
                });
            });
        
    })

    // get all the measures (accessed at GET http://localhost:8080/measures)
    .get(function(req, res) {
        Measure.find({}, function(err, measures) {
            if (err) res.send(err);
            res.json(measures);
        });
    });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/measures/all/:user_id')
    // get the user with that id
    .get(function(req, res) {
        console.log("\n\nreq.params.user_id: " + req.params.user_id);
        Measure.find({ user_id: req.params.user_id } , function(err, measure) {
            if (err) res.send(err);
            // return that user
            console.log("\n\nResponse: " + measure);
            res.json(measure);
        });
    });

    // on routes that end in /users/:user_id
    // ----------------------------------------------------
    apiRouter.route('/measures/:measure_id')
    // get the user with that id
    .get(function(req, res) {
        Measure.findOne({ _id: req.params.measure_id } , function(err, measure) {
            if (err) res.send(err);
            res.json(measure);
        });
    })
    // update the user with this id
    .put(function(req, res) {
        Measure.findById(req.params.measure_id, function(err, measure) {
            if (err) res.send(err);

            // set the new user information if it exists in the request
            if (req.body.value) measure.value = req.body.value;
            if (req.body.meal) measure.meal = req.body.meal;
            if (req.body.note) measure.note = req.body.note;
            if (req.body.date) measure.date = req.body.date;
            if (req.body.time) measure.time = req.body.time;
        
            console.log(measure);

            measure.save(function(err) {
                if (err) res.send(err);
                res.json({message: 'Measure Successfully Updated!'});
            });

        });
    })
    // delete the user with this id
    .delete(function(req, res) {
        console.log("Measure.delete: " + req);
        Measure.remove({ _id: req.params.measure_id}, function(err, measure) {
            console.log("Measure.remove: " + measure);
            if (err) res.send(err);
            res.json({ message: 'Measure Successfully Deleted' });
        });
    });


    // api endpoint to get user information
    apiRouter.get('/me', function(req, res) {
        res.send(req.decoded);
    });

    return apiRouter;
};
