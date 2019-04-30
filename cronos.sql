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
	id SERIAL PRIMARY KEY NOT NULL,
	day_of_week VARCHAR(100) NOT NULL,
	break_time VARCHAR(10) NULL,
	week_start_date VARCHAR(100) NOT NULL,
	time_in VARCHAR(200) NOT NULL,
	time_out VARCHAR(200) NOT NULL
);

SELECT * FROM timecard;

drop table timecard;
