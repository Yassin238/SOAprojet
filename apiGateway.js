// apiGateway.js
const express = require('express');
const { ApolloServer } = require('@apollo/server');
const { expressMiddleware } = require ('@apollo/server/express4');
const bodyParser = require('body-parser');
const cors = require('cors');
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les CD et les DVD
const cdProtoPath = 'cd.proto';


const resolvers = require('./resolvers');
const typeDefs = require('./schema');

// Créer une nouvelle application Express
const app = express();

const cdProtoDefinition = protoLoader.loadSync(cdProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});



const cdProto = grpc.loadPackageDefinition(cdProtoDefinition).cd;

// Créer une instance ApolloServer avec le schéma et les résolveurs importés
const server = new ApolloServer({ typeDefs, resolvers });

// Appliquer le middleware ApolloServer à l'application Express
server.start().then(() => {
  app.use(
    cors(),
    bodyParser.json(),
    expressMiddleware(server),
  );
});

app.get('/cds', (req, res) => {
  const client = new cdProto.CDService('localhost:50051', grpc.credentials.createInsecure());
  client.searchCDs({}, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.cds);
    }
  });
});

app.get('/cds/:id', (req, res) => {
  const client = new cdProto.CDService('localhost:50051', grpc.credentials.createInsecure());
  const id = req.params.id;
  client.getCD({ cd_id: id }, (err, response) => {
    if (err) {
      res.status(500).send(err);
    } else {
      res.json(response.cd);
    }
  });
});



// Démarrer l'application Express
const port = 3000;
app.listen(port, () => {
  console.log(`API Gateway en cours d'exécution sur le port ${port}`);
});
