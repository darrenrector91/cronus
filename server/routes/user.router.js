const express = require('express');
const encryptLib = require('../modules/encryption');
const userStrategy = require('../strategies/sql.localstrategy');
const pool = require('../modules/pool.js');
const router = express.Router();

router.get('/', (req, res) => {
    if (req.isAuthenticated()) {
        res.send(req.user);
    } else {
        res.sendStatus(403);
    }
});

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

router.post('/login', userStrategy.authenticate('local'), (req, res) => {
    res.sendStatus(200);
});
router.get('/logout', (req, res) => {
    req.logout();
    res.sendStatus(200);
});

router.get('/getTableData', (req, res) => {
    const queryText =
        `SELECT
        day_of_week,
        break_time,
        week_start_date,
        time_in,
        time_out
        FROM timecard
        ORDER BY
        week_start_date ASC`;
    pool.query(queryText)
        .then((result) => {
            console.log('table data results:', result);
            res.send(result);
        })
        .catch((err) => {
            console.log('error making query:', err);
            res.sendStatus(500);
        });
});

router.get('/getWeekStart', (req, res) => {
    const queryText =
        `SELECT DISTINCT
        week_start_date
        FROM
        timecard
        ORDER BY
        week_start_date ASC`;
    pool.query(queryText)
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log('error making getWeekStart query:', err);
            res.sendStatus(500);
        })
});

router.post('/addItem', function (req, res) {
    console.log('in POST router');
    if (req.isAuthenticated()) {
        const queryText = `INSERT INTO timecard ( 
        week_start_date,
        time_in,
        time_out,
        day_of_week,
        break_time) 
        VALUES ($1, $2, $3, $4, $5)`;
        pool.query(queryText, [
                req.body.week_start_date,
                req.body.time_in,
                req.body.time_out,
                req.body.day_of_week,
                req.body.break_time
            ])
            .then((result) => {
                console.log('result:', result);
                res.send(result);
            })
            .catch((err) => {
                console.log('error:', err);
                res.sendStatus(500);
            });
    } else {
        res.sendStatus(403);
    };
});

router.get('/getSelectWeek/:data', function (req, res) {
    console.log('in get event');
    const queryText =
        `SELECT 
        timecard_id,
        day_of_week, 
        user_id
        break_time, 
        week_start_date, 
        time_in, 
        time_out 
        FROM 
        timecard 
        WHERE 
        week_start_date = $1`;
    pool.query(queryText, [req.params.data])
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.get('/editTimeEntry/:data', function (req, res) {
    console.log('in get event');
    const queryText =
        `SELECT 
        timecard_id,
        day_of_week, 
        user_id
        break_time, 
        week_start_date, 
        time_in, 
        time_out 
        FROM 
        timecard 
        WHERE 
        timecard_id = $1`;
    pool.query(queryText, [req.params.data])
        .then((result) => {
            console.log(result);
            res.send(result);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

router.delete('/deleteItem/:id', function (req, res) {
    // console.log('in router.delete');
    const queryText = 'DELETE FROM timecard WHERE timecard_id = $1';
    pool.query(queryText, [req.params.id])
        .then((result) => {
            console.log('result:', result.rows);
            res.sendStatus(200);
        })
        .catch((err) => {
            console.log('error:', err);
            res.sendStatus(500);
        });
});

module.exports = router;