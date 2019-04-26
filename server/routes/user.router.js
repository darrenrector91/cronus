const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

// Handles Ajax request for user information if user is authenticated
router.get('/', (req, res) => {
    // check if logged in
    if (req.isAuthenticated()) {
        // send back user object from database
        res.send(req.user);
    } else {
        // failure best handled on the server. do redirect here.
        res.sendStatus(403);
    }
});

// Handles POST request with new user data
// The only thing different from this and every other post we've seen
// is that the password gets encrypted before being inserted
router.post('/register', (req, res, next) => {
    const username = req.body.username;
    const password = encryptLib.encryptPassword(req.body.password);
    const first_name = req.body.first_name;
    const last_name = req.body.last_name;
    const job_position = req.body.job_position;

    var saveUser = {
        username: req.body.username,
        password: encryptLib.encryptPassword(req.body.password),
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        job_position: req.body.job_position
    };
    // console.log('new user:', saveUser);
    pool.query(`INSERT INTO users
    (username,
      password,
      first_name,
      last_name,
      job_position)
      VALUES
      ($1, $2, $3, $4, $5)
      RETURNING id`,
        [saveUser.username,
            saveUser.password,
            saveUser.first_name,
            saveUser.last_name,
            saveUser.job_position
        ],
        (err, result) => {
            if (err) {
                // console.log("Error inserting data: ", err);
                res.sendStatus(500);
            } else {
                res.sendStatus(201);
            }
        });
});

// Handles login form authenticate/login POST
// userStrategy.authenticate('local') is middleware that we run on this route
// this middleware will run our POST if successful
// this middleware will send a 404 if not successful
router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});

// clear all server session information about this user
router.get('/logout', (req, res) => {
    // Use passport's built-in method to log out the user
    req.logout();
    res.sendStatus(200);
});

router.post('/addItem', function (req, res) {
    console.log('in POST router');
    if (req.isAuthenticated()) {
        //add catch event to user data table
        const queryText = `INSERT INTO timecard ( 
        weekStartDate,
        time_in,
        time_out,
        workday) 
        VALUES ($1, $2, $3, $4)`;
        pool.query(queryText, [
                req.body.weekStartDate,
                req.body.time_in,
                req.body.time_out,
                req.body.workday
            ])
            .then((result) => {
                console.log('result:', result);
                res.send(result);
            })
            // erorr handling
            .catch((err) => {
                console.log('error:', err);
                res.sendStatus(500);
            });
    } else {
        // failure best handled on the server. do redirect here.
        res.sendStatus(403);
    }
});

module.exports = router;