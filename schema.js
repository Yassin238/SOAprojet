const { gql } = require('@apollo/server');

// Définir le schéma GraphQL
const typeDefs = `
  type CD {
    id: String!
    title: String!
    artist: String!
    genre: String!
    releaseYear: Int!
    price: Float!
  }

  

  type Query {
    cd(id: String!): CD
    cds: [CD]
  }
`;

module.exports = typeDefs;
