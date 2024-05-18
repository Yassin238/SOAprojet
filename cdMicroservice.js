// cdMicroservice.js
const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger le fichier cd.proto
const cdProtoPath = 'cd.proto';
const cdProtoDefinition = protoLoader.loadSync(cdProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
const cdProto = grpc.loadPackageDefinition(cdProtoDefinition).cd;

// Implémenter le service CD
const cdService = {
  getCD: (call, callback) => {
    // Récupérer les détails du CD à partir de la base de données
    const cd = {
      id: call.request.cd_id,
      title: 'Exemple de CD',
      artist: 'Artiste Exemple',
      genre: 'Genre Exemple',
      releaseYear: 2023,
      price: 9.99,
    };
    callback(null, { cd });
  },
  searchCDs: (call, callback) => {
    const { query } = call.request;
    // Effectuer une recherche de CD en fonction de la requête
    const cds = [
      {
        id: '1',
        title: 'Exemple de CD 1',
        artist: 'Artiste 1',
        genre: 'Genre 1',
        releaseYear: 2021,
        price: 12.99,
      },
      {
        id: '2',
        title: 'Exemple de CD 2',
        artist: 'Artiste 2',
        genre: 'Genre 2',
        releaseYear: 2022,
        price: 14.99,
      },
      // Ajouter d'autres résultats de recherche de CD au besoin
    ];
    callback(null, { cds });
  },
  // Ajouter d'autres méthodes au besoin
};

// Créer et démarrer le serveur gRPC
const server = new grpc.Server();
server.addService(cdProto.CDService.service, cdService);
const port = 50051;
server.bindAsync(`0.0.0.0:${port}`, grpc.ServerCredentials.createInsecure(), (err, port) => {
  if (err) {
    console.error('Échec de la liaison du serveur:', err);
    return;
  }
  console.log(`Le serveur s'exécute sur le port ${port}`);
  server.start();
});
console.log(`Microservice de CD en cours d'exécution sur le port ${port}`);
