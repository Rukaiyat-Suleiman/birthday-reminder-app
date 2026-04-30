import request from 'supertest';
import app from './main.js';
import { User, sequelize } from './db.js';

beforeAll(async () => {
    // Sync the database and clear data before tests
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    // Close the database connection after tests
    await sequelize.close();
});

describe('Endpoints Coverage', () => {
    describe('GET /', () => {
        it('should return the rendered HTML view', async () => {
            const response = await request(app)
                .get('/')
                .expect('Content-Type', /html/)
                .expect(200);

            // Verifying that it returns HTML string with the expected title
            expect(response.text).toMatch(/Birthday Reminder Setup/);
        });
    });

    describe('POST /api/users', () => {
        const validUser = {
            username: 'John Doe',
            email: 'john.doe@example.com',
            dob: '1995-08-20'
        };

        it('should create a new user and return 201', async () => {
            const response = await request(app)
                .post('/api/users')
                .send(validUser)
                .expect('Content-Type', /json/)
                .expect(201);

            expect(response.body).toMatchObject({
                success: true,
                statusCode: 201,
                message: 'User added successfully'
            });
            expect(response.body.data).toHaveProperty('username', validUser.username);
            expect(response.body.data).toHaveProperty('email', validUser.email);
            expect(response.body.data).toHaveProperty('dob', validUser.dob);
        });

        it('should return 409 if the email already exists', async () => {
            // Attempt to create the same user again
            const response = await request(app)
                .post('/api/users')
                .send(validUser)
                .expect('Content-Type', /json/)
                .expect(409);

            expect(response.body).toEqual({
                success: false,
                statusCode: 409,
                message: 'Email already exists'
            });
        });

        it('should return 400 for validation error (missing fields)', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ username: 'Jane' }) // Missing email and dob
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toMatch(/"email" is required/);
        });
        
        it('should return 400 for validation error (invalid email format)', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ ...validUser, email: 'not-an-email' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toMatch(/"email" must be a valid email/);
        });

        it('should return 400 for validation error (invalid date format)', async () => {
            const response = await request(app)
                .post('/api/users')
                .send({ ...validUser, email: 'jane.doe@example.com', dob: 'invalid-date' })
                .expect('Content-Type', /json/)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toMatch(/"dob" must be in ISO 8601 date format/);
        });
    });
});