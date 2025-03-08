create database titrate;

use titrate;

create table user (
    id int not null AUTO_INCREMENT,
    email varchar(255) not null unique,
    primary key (id)
);

create table food (
    id int not null AUTO_INCREMENT,
    name varchar(255) not null,
    primary key (id)
);

SELECT * FROM food;

create table rating (
    id int not null AUTO_INCREMENT,
    user_id int not null,
    food_id int not null,
    rating BOOLEAN,
    foreign key (user_id) references user (id),
    foreign key (food_id) references food (id),
    primary key (id)
);

create table additionalQuestions (
    id int not null AUTO_INCREMENT,
    user_id int not null,
    temperature_rating int,
    portion_rating int,
    appearance_rating int,
    foreign key (user_id) references user (id),
    primary key (id)
);



alter table additionalQuestions
add column rating_id int not null,
add foreign key (rating_id) references rating (id);
SELECT * FROM rating;

SELECT * FROM additionalQuestions;


SELECT * FROM rating;