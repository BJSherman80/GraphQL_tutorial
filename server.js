

var express = require('express');
var { graphqlHTTP } = require('express-graphql');
var { buildSchema } = require('graphql');

var users = [
  {
    id: 1, 
    name: 'Kevin',
    age: '26',
    shark: 'Tuna Shark'
  },
  {
    id: 2, 
    name: 'Burt',
    age: '99',
    shark: 'Mako Shark'
  },
  {
    id: 3, 
    name: 'Lyle',
    age: '5',
    shark: 'Blue Shark'
  },
  {
  id: 4, 
  name: 'Kevin',
  age: '26',
  shark: 'Tuna Shark'
  }
];

// Return a single user (based on id)
var getUser = function(args) {
  var userID = args.id;
  return users.filter(user => user.id == userID)[0];
}

// Return a list of users (takes an optional shark parameter)
var retrieveUsers = function(args) {
  if (args.shark) {
    var shark = args.shark;
    return users.filter(user => user.shark === shark);
  } else {
    return users;
  }
}

// Update a user and return new user details
var updateUser = function({id, name, age}) {
  users.map(user => {
    if (user.id === id) {
      user.name = name;
      user.age = age;
      return user;
    }
  });
  return users.filter(user => user.id === id)[0];
}


// Initialize a GraphQL schema
var schema = buildSchema(`
  type Query {
    user(id: Int!): Person
    users(shark: String): [Person]
  },
  type Person {
    id: Int
    name: String
    age: Int
    shark: String
  },
  type Mutation {
    updateUser(id: Int!, name: String!, age: String): Person
}
`);

// Root resolver
var root = {
  user: getUser,  
  users: retrieveUsers,
  updateUser: updateUser 
};

// Create an express server and a GraphQL endpoint
var app = express();
app.use('/graphql', graphqlHTTP({
  schema: schema,  // Must be provided
  rootValue: root,
  graphiql: true,  // Enable GraphiQL when server endpoint is accessed in browser
}));
app.listen(4000, () => console.log('Now browse to localhost:4000/graphql'));