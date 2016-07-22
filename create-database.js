var sworm = require('sworm');
var co = require('co');
var _ = require('lodash');

var config = {
    driver: "sqlite",
    config: {
        filename: "db.dat"
    }
};

var db = sworm.db(config);
var faker = require('faker');

co(function*() {
        yield db.query('drop table if exists user');
        yield db.query(`create table user(
               id integer,
               name varchar(50) null,
               city_id integer null,
               job_id integer null,
               primary key(id)
     )`);
        yield db.query('drop table if exists role');
        yield db.query(`create table role(
               id integer,
               name varchar(50) null,
               primary key(id)
     )`);
        yield db.query('drop table if exists user_role');
        yield db.query(`create table user_role(
               user_id integer,
               role_id integer,
               primary key (user_id, role_id)
     )`);
        yield db.query('drop table if exists city');
        yield db.query(`create table city(
               id integer,
               name varchar(50) null,
               primary key(id)
     )`);
        yield db.query('drop table if exists job');
        yield db.query(`create table job(
               id integer,
               title varchar(50) null,
               type varchar(50) null,
               area varchar(50) null,
               primary key(id)
     )`);

        // Generate city list.
        var cityEntity = db.model({table: 'city'});
        var cityList = [];
        for (var i = 0; i < 3; i++) {
            cityList[i] = cityEntity({
                name: faker.address.city()
            });
        }

        // Generate job list.
        var jobEntity = db.model({table: 'job'});
        var jobList = [];
        for (var i = 0; i < 3; i++) {
            jobList[i] = jobEntity({
                title : faker.name.jobTitle(),
                type : faker.name.jobType(),
                area : faker.name.jobArea(),
            });
        }
    
        // Generate user list.
        var userEntity = db.model({table: 'user'});
        var userList = [];
        for (var i = 0; i < 15; i++) {
            var user = userEntity({
                name: faker.name.findName(),
                city: _.sample(cityList),
                job: _.sample(jobList),
            });
            // user.save();
            userList.push(user);
        }

        // Generate roles.
        var roleEntity = db.model({table: 'role'});
        var roleList = [];
        for (var i = 0; i < 4; i++) {
            var role = roleEntity({
                name: faker.hacker.noun()
            });
            // role.save();
            roleList.push(role);
        }

        // Save other.
        var userRoleEntity = db.model({
            table: 'user_role',
            id: ['user_id', 'role_id']
        });

        userList.forEach(user => {
            _.shuffle(roleList);
            var someRoles = _.take(roleList, _.random(1, 3, false));
            someRoles.map(r => {
                return userRoleEntity({user: user, role: r}).save();
            });
            // user.role = (user.role || []).concat(someRoles);
            user.save();
        });
        
        // var ur1 = userRole({user: bob, role: admin});
        // var ur2 = userRole({user: bob, role: user});

    })
    .then(function() {
        console.log('Done.');
    })
    .catch(function(err) {
        console.error(err);
    });