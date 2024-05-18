const grpc = require('@grpc/grpc-js');
const protoLoader = require('@grpc/proto-loader');

const PROTO_PATH = './dvd.proto';

const packageDefinition = protoLoader.loadSync(PROTO_PATH, {
    keepCase: true,
    longs: String,
    enums: String,
    defaults: true,
    oneofs: true
});

const dvdProto = grpc.loadPackageDefinition(packageDefinition).dvd;

const client = new dvdProto.DVDService('localhost:50052', grpc.credentials.createInsecure());

// Log the client object to inspect its structure
console.log('Client:', client);

// Check if searchDVDs method exists on DVDService
if (client && client.DVDService && typeof client.DVDService.searchDVDs === 'function') {
    console.log('searchDVDs method exists on DVDService');
} else {
    console.error('searchDVDs method does not exist on DVDService');
}

client.searchDVDs({ query: '' }, (error, response) => {
    if (error) {
        console.error('Error:', error);
    } else {
        console.log('List of DVDs:', response.dvds);
    }
});
