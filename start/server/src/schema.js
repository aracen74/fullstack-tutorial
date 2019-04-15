// Step 2
// import gql all details of schema go between ticks
const { gql } = require('apollo-server');

const typeDefs = gql`

# Step 3 define Query type
# Query type ^-^  which is the entry point into our schema that describes what data we can fetch.
# ! means this will never be nullable . All types are nullable by default
#type Query {
# launches: [Launch]!
#  launch(id: ID!): Launch
#  me: User
#}


# Step 19 -- Update "Query" for paging
type Query {
    launches(#replace the current launches query with this one.
            """
            The number of results to show.Must be >= 1. Default = 20
            """
            pageSize: Int 
            """
            If you add a cursor here, it will only
            return results _after_ this cursor 
            """
            after: String
        ): LaunchConnection!
        launch(id: ID!): Launch
    me: User
}

"""
Simple wrapper around our list of launches that contains a cursor to the
last item in the list.Pass this cursor to the launches query to fetch results
after these.
"""
type LaunchConnection {
    # add this below the Query type as an additional type.
    cursor: String! #keeps track where we are
    hasMore: Boolean!
    launches: [Launch] !
}

# Step 4 define types
type Launch {
    id: ID!
    site: String
    mission: Mission
    rocket: Rocket
    isBooked: Boolean!
}

type Rocket {
    id: ID!
        name: String
    type: String
}

type User {
    id: ID!
        email: String!
        trips: [Launch]!
}

type Mission {
    name: String
    #    GraphQL is flexible because any fields can contain arguments, not just queries.
    missionPatch(size: PatchSize): String
}

enum PatchSize {
    SMALL
    LARGE
}

# Step 5 define Mutation Type ^_^
# entry point into our graph for modifying data
# take in args and return "TripUpdateResponse"
type Mutation {
    #  if false, booking trips failed--check errors
    bookTrips(launchIds: [ID]!): TripUpdateResponse!

    #  if false, cancellation failed--check errors
    cancelTrip(launchId: ID!): TripUpdateResponse!

    login(email: String): String# login token
}

type TripUpdateResponse {
    success: Boolean!
    message: String
    launches: [Launch]
}

`;

module.exports = typeDefs


