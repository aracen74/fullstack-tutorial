// Step 1
const { ApolloServer } = require('apollo-server');
const typeDefs = require('./schema');

// Step 13 - Import createStore and our LaunchAPI and UserApi
const { createStore} = require('./utils');
const LaunchAPI = require('./datasources/launch');
const UserAPI = require('./datasources/user');

// Step 16 Import resolvers
const resolvers = require('./resolvers');

// Step 23 Import email for authentication
const isEmail = require('isemail');

// Step 14 Create a SQLite based store
const store = createStore();

const server = new ApolloServer({
    // Step 25 add context property for Authentication
      context: async ({ req }) => {
          // simple auth check on every request
          const auth = (req.headers && req.headers.authorization) || '';
          const email = Buffer.from(auth, 'base64').toString('ascii');

          // if the email isn't formatted validly, return null for user
        if (!isEmail.validate(email)) return { user: null };
        
          // find a user by their email
        const users = await store.users.findOrCreate({ where: { email } });
        
          const user = users && users[0] ? users[0] : null;

        // attach the user to the context
          return { user: { ...user.dataValues } };
      },
    typeDefs,
    // Step 17 Add resolvers to Apollo Service
    // Apollo Server will automatically add the launchAPI and userAPI to our resolvers' context so we can easily call them.
    resolvers,
    // Step 15 - add Data Sources to ApolloServer
      dataSources: () => ({
          launchAPI: new LaunchAPI(),
          userAPI: new UserAPI({
              store
          }),
      })
})

// Step 6
server.listen().then(({
    url
}) => {
    console.log(`🚀 Server ready at ${url}`);
});

// Step 7 
// run npm start from cd D:\repos\fullstack-tutorial\start\server
// open to browser to port http://localhost:4000/
// click SCHEMA on far right of browser to inspect schema