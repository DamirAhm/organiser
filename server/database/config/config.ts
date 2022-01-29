import dotenv from 'dotenv';

dotenv.config();

function getMongoDbURI() {
  switch ( process.env.NODE_ENV ) {
    case 'production': return process.env.DATABASE_URI
    case 'test': return process.env.TEST_DATABASE_URI
    case 'development': return process.env.DEV_DATABASE_URI
    default: return process.env.DATABASE_URL
  }
}

export default {
  MONGODB_URI: getMongoDbURI() as string
};