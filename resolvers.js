const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

// Charger les fichiers proto pour les CD et les DVD
const cdProtoPath = 'cd.proto';


const cdProtoDefinition = protoLoader.loadSync(cdProtoPath, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});



const cdProto = grpc.loadPackageDefinition(cdProtoDefinition).cd;

// Définir les résolveurs pour les requêtes GraphQL
const resolvers = {
  Query: {
    cd: (_, { id }) => {
      const client = new cdProto.CDService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.getCD({ cd_id: id }, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.cd);
          }
        });
      });
    },
    cds: () => {
      const client = new cdProto.CDService('localhost:50051', grpc.credentials.createInsecure());
      return new Promise((resolve, reject) => {
        client.searchCDs({}, (err, response) => {
          if (err) {
            reject(err);
          } else {
            resolve(response.cds);
          }
        });
      });
    },
    
  },
};

module.exports = resolvers;
