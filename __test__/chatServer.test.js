const request = require("supertest");
const {Chat} = require("../models").models;
const app = require("../app");

// jest.setTimeout(30000);

beforeAll(async() => {
    await Chat.insertMany([
        {
            fromUserId:3,
            toUserId:5,
            message: [
                {
                    sender:3,
                    message:"kdlfjalsjfldfk"
                },
                {
                    sender:5,
                    message:"kdlfjalsjfldfk22"
                },
                {
                    sender:3,
                    message:"kdlfjalsjfldfk33"
                }
            ]
        },
        {
            fromUserId:9,
            toUserId:1,
            message: [
                {
                    sender:1,
                    message:"kdlfjalsjfldfk"
                },
                {
                    sender:1,
                    message:"kdlfjalsjfldfk22"
                },
                {
                    sender:9,
                    message:"kdlfjalsjfldfk33"
                }
            ]
        }
    ], (err) => {
        console.log(err);
    })
})

afterAll(async() => {
    await Chat.deleteMany({});
}) 

describe('Chat Testing', () => {
    it('should success return message history', (done) => {
        request(app)
        .get("/message/3/5")
        .then(resp => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toEqual(expect.any(Object))
            expect(resp.body).toHaveProperty("fromUserId", expect.any(Number))
            expect(resp.body).toHaveProperty("toUserId", expect.any(Number))
            expect(resp.body).toHaveProperty("message", expect.any(Array))
            expect(resp.body.message).toHaveLength(3)
            expect(resp.body.message[0]).toHaveProperty("sender", expect.any(Number))
            expect(resp.body.message[0]).toHaveProperty("message", expect.any(String))
            done();
        })
    });
    it('should failed because the from user id is not valid on getting 1 data', (done) => {
        request(app)
        .get("/message/1000/9282")
        .then(resp => {
            expect(resp.statusCode).toBe(404);
            expect(resp.body.message).toEqual("Not found");
            done()
        })
    });
    it('should failed because the from user id is not valid', (done) => {
        request(app)
        .get("/message/99999999999999999")
        .then(resp => {
            // console.log(resp.body);
            expect(resp.statusCode).toBe(404);
            expect(resp.body.message).toBe("Not found");
            done()
        })
    });
    it('should success get all users', (done) => {
        request(app)
        .get("/message/3")
        .then(resp => {
            expect(resp.statusCode).toBe(200);
            expect(resp.body).toEqual(expect.any(Array));
            expect(resp.body[0]).toEqual(expect.any(Object));
            expect(resp.body[0]).toHaveProperty("fromUserId", expect.any(Number))
            expect(resp.body[0]).toHaveProperty("toUserId", expect.any(Number))
            expect(resp.body[0]).toHaveProperty("message", expect.any(Array))
            expect(resp.body[0].message).toHaveLength(3)
            expect(resp.body[0].message[0]).toHaveProperty("sender", expect.any(Number))
            expect(resp.body[0].message[0]).toHaveProperty("message", expect.any(String))
            done();
        })
    });
    it('should success adding a message', () => {
        request(app)
        .post("/message")
        .send({
            from:3,
            to:5,
            message:"test"
        })
        .set('Accept', 'application/json')
        .then(resp => {
            expect(resp.statusCode).toBe(201);
            expect(resp.body).toEqual(expect.any(Object))
            expect(resp.body).toHaveProperty("fromUserId", expect.any(Number))
            expect(resp.body).toHaveProperty("toUserId", expect.any(Number))
            expect(resp.body).toHaveProperty("message", expect.any(Array))
            done();
        })
    });
    it('should failed because the from user id is invalid', () => {
        request(app)
        .post("/message")
        .send({
            from:'flkajsdflsajlksdfjlkad',
            to:5,
            message:"test"
        })
        .set('Accept', 'application/json')
        .then(resp => {
            expect(resp.statusCode).toBe(400);
            expect(resp.body).toHaveProperty("message", "Input is invalid")
            done();
        })
    });
    it('should failed because the to user id is invalid', () => {
        request(app)
        .post("/message")
        .send({
            from:9,
            to:"fjklfdsjflaj",
            message:"test22"
        })
        .set('Accept', 'application/json')
        .then(resp => {
            expect(resp.statusCode).toBe(400);
            expect(resp.body).toHaveProperty("message", "Input is invalid")
            done();
        })
    });
    it('should failed because the message is empty', () => {
        request(app)
        .post("/message")
        .send({
            from:9,
            to:4,
            message:""
        })
        .set('Accept', 'application/json')
        .then(resp => {
            expect(resp.statusCode).toBe(400);
            expect(resp.body).toHaveProperty("message", "Input is invalid")
            done();
        })
    });
    
});
