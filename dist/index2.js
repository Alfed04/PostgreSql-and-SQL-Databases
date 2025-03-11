"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pg_1 = require("pg");
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
const client = new pg_1.Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
function createTables() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        try {
            const createTablesQuery = `CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE addresses (
    id SERIAL PRIMARY KEY,
    user_id INTEGER NOT NULL,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    street VARCHAR(255) NOT NULL,
    pincode VARCHAR(20),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);`;
            const response = yield client.query(createTablesQuery);
            // console.log(response) 
        }
        catch (error) {
            console.log("error : ", error);
        }
        finally {
            yield client.end();
        }
    });
}
// createTables()
app.post("/post", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const city = req.body.city;
    const country = req.body.country;
    const street = req.body.street;
    const pincode = req.body.pincode;
    try {
        yield client.query('BEGIN;');
        const insertQuery = 'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id';
        const response = yield client.query(insertQuery, [username, email, password]);
        const user_id = response.rows[0].id;
        const insertQueryAddress = 'INSERT INTO addresses (user_id,city,country,street,pincode) VALUES ($1,$2,$3,$4,$5)';
        yield client.query(insertQueryAddress, [user_id, city, country, street, pincode]);
        yield client.query('COMMIT;');
    }
    catch (error) {
        yield client.query("ROLLBACK");
        console.log("Transaction rolled back after error ,", error);
    }
    res.json({
        message: "entries populated successfully"
    });
}));
app.get("/metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const query1 = "SELECT * FROM users WHERE id=$1";
    const response = yield client.query(query1, [id]);
    const query2 = "SELECT * FROM addresses WHERE user_id=$1";
    const response2 = yield client.query(query2, [id]);
    res.json({
        users: response.rows,
        address: response2.rows
    });
}));
client.connect();
app.get("/better-metadata", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const id = req.query.id;
    const query = `
            SELECT * FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id=$1
    `;
    const response = yield client.query(query, [id]);
    res.json({
        response: response.rows
    });
}));
app.listen(3000, () => {
    console.log("App is listening to the requests coming at port number 3000");
});
//By default join performed is inner join , you can either write inner join or join
