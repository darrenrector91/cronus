CREATE TABLE users (
    id SERIAL PRIMARY KEY NOT NULL,
    username VARCHAR(50) NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
	job_position VARCHAR(50) NOT NULL
);

SELECT * FROM users;


CREATE TABLE timecard (
	timecard_id SERIAL PRIMARY KEY NOT NULL,
	day_of_week VARCHAR(100) NOT NULL,
	break_time VARCHAR(10) NULL,
	week_start_date VARCHAR(100) NOT NULL,
	user_id INT REFERENCES users,
	time_in VARCHAR(200) NOT NULL,
	time_out VARCHAR(200) NOT NULL
);

SELECT * FROM users;

SELECT 
        timecard_id,
        day_of_week, 
        user_id
        break_time, 
        week_start_date, 
        time_in, 
        time_out 
        FROM 
        timecard 
        JOIN
        users on users.id = timecard.user_id
        WHERE 
        week_start_date = '2019-04-08T05:00:00.000Z' AND users.id ='1';


drop table timecard;

SELECT day_of_week, break_time, week_start_date, time_in, time_out FROM timecard;

SELECT DISTINCT week_start_date FROM timecard ORDER BY week_start_date ASC;

SELECT day_of_week, break_time, week_start_date, time_in, time_out FROM timecard WHERE week_start_date = '2019-04-08T05:00:00.000Z';