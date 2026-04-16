const request = require('supertest');
const app = require('../server');
const User = require('../models/User');

jest.mock('../models/User');

describe('Auth Endpoints', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('POST /api/auth/signup', () => {
    it('should create a new user and return token', async () => {
      const mockUser = {
        _id: 'userid123',
        name: 'Test User',
        email: 'test@college.edu',
        role: 'student',
      };

      User.findOne.mockResolvedValue(null);
      User.create.mockResolvedValue(mockUser);

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@college.edu',
          password: 'password123',
          branch: 'CS',
          year: '1st Year'
        });

      expect(res.statusCode).toEqual(201);
      expect(res.body).toHaveProperty('token');
      expect(res.body.name).toEqual('Test User');
    });

    it('should return 400 if user already exists', async () => {
      User.findOne.mockResolvedValue({ email: 'test@college.edu' });

      const res = await request(app)
        .post('/api/auth/signup')
        .send({
          name: 'Test User',
          email: 'test@college.edu',
          password: 'password123',
          branch: 'CS',
          year: '1st Year'
        });

      expect(res.statusCode).toEqual(400);
      expect(res.body.message).toEqual('User already exists');
    });
  });

  describe('POST /api/auth/login', () => {
    it('should authenticate user and return token', async () => {
      const mockUser = {
        _id: 'userid123',
        name: 'Test User',
        email: 'test@college.edu',
        role: 'student',
        matchPassword: jest.fn().mockResolvedValue(true)
      };

      User.findOne.mockReturnValue({
        select: jest.fn().mockResolvedValue(mockUser)
      });

      const res = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'test@college.edu',
          password: 'password123'
        });

      expect(res.statusCode).toEqual(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});
