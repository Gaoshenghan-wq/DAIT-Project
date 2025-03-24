const { MongoClient, ObjectId } = require('mongodb');

process.env.MONGODB_URI = 'mongodb://24428078hkbu:HS0XhVy5FdXGD4rj2oe696oqMCMpthIYc696poNSdo0ZCx81Uox86qNss07iFNrCMJEJHv0aLNxnACDbmWItdg==@24428078hkbu.mongo.cosmos.azure.com:10255/?ssl=true&retrywrites=false&maxIdleTimeMS=120000&appName=@24428078hkbu@';

if (!process.env.MONGODB_URI) {
    // throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
    process.env.MONGODB_URI = 'mongodb://localhost:27017';
}

// Connect to MongoDB
async function connectToDB() {
    const client = await MongoClient.connect(process.env.MONGODB_URI);
    const db = client.db('bookingsDB');
    db.client = client;
    return db;
}

module.exports = { connectToDB, ObjectId };