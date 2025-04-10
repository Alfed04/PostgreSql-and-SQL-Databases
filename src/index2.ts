import {Client}  from 'pg';
import express, { query } from 'express';
const app = express()
app.use(express.json())

const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")
// const client2 = new Client({
//     host: 'my.database-server.com',
//     port: 5334,
//     database: 'database-name',
//     user: 'database-user',
//     password: 'secretpassword!!',
//     ssl: true
// })

async function createTables(){
    await client.connect()
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
);`
        const response = await client.query(createTablesQuery)
        // console.log(response) 
    } catch (error) {
        console.log("error : ",error)
    }finally{
        await client.end()
    }
}
createTables()

app.post("/post",async (req,res)=>{
    const username = req.body.username
    const email = req.body.email
    const password = req.body.password
    const city = req.body.city
    const country = req.body.country
    const street = req.body.street
    const pincode = req.body.pincode
try{
    await client.query('BEGIN;')
    const insertQuery  = 'INSERT INTO users (username,email,password) VALUES ($1,$2,$3) RETURNING id'
    const response = await client.query(insertQuery,[username,email,password])
    const user_id = response.rows[0].id
    
    const insertQueryAddress  = 'INSERT INTO addresses (user_id,city,country,street,pincode) VALUES ($1,$2,$3,$4,$5)'
    await client.query(insertQueryAddress,[user_id,city,country,street,pincode])
    await client.query('COMMIT;')
}
catch(error){
    await client.query("ROLLBACK")
    console.log("Transaction rolled back after error ,",error)
}
    res.json({
        message:"entries populated successfully"
    })
    
})

app.get("/metadata",async (req,res)=>{
    const id = req.query.id
    const query1 = "SELECT * FROM users WHERE id=$1"
    const response = await client.query(query1,[id])
    const query2 = "SELECT * FROM addresses WHERE user_id=$1"
    const response2 = await client.query(query2,[id])
    res.json({
        users:response.rows,
        address:response2.rows
    })
})

client.connect();
app.get("/better-metadata",async (req,res)=>{
    const id = req.query.id
    const query = `
            SELECT * FROM users JOIN addresses ON users.id = addresses.user_id WHERE users.id=$1
    `
    const response = await client.query(query,[id])
    res.json({
        response:response.rows
    })
})

app.listen(3000,()=>{
    console.log("App is listening to the requests coming at port number 3000")
})


// By default join performed is inner join , you can either write inner join or join