const mongoose = require('mongoose');

// Mock connectDB module
jest.mock('../config/db', () => jest.fn().mockResolvedValue(true));

// Mock mongoose to avoid real DB connection during tests
jest.mock('mongoose', () => {
  const actualMongoose = jest.requireActual('mongoose');
  return {
    ...actualMongoose,
    connect: jest.fn().mockResolvedValue(true),
    connection: {
      on: jest.fn(),
      once: jest.fn(),
      host: 'localhost', // Added for logging purposes
    },
  };
});
