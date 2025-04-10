//# Create Table
import {Client} from "pg";

async function createUserTable(){
    const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")

    try {
        await client.connect()
        const result = await client.query(`
            CREATE TABLE users(
                id SERIAL PRIMARY KEY,
                username VARCHAR(25) UNIQUE NOT NULL,
                email VARCHAR(50) UNIQUE NOT NULL,
                password VARCHAR(50) NOT NULL,
                createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
            );
            `)
        console.log("table created ",result)
        
    } catch (error) {
        console.log('error while creating table : error ',error)
    }finally{
        await client.end()
    }
    
}
// createUserTable()

//#Insert data
// import {Client} from "pg";

async function insertData(){
    const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")

    try {
        await client.connect()
        const result = await client.query(`
            INSERT INTO users(username,email,password) VALUES ('alfed2','alfed@222','alfedKhan3333')
            `)
        console.log("data inserted ",result)
        
    } catch (error) {
        console.log('error while inserting table : error ',error)
    }finally{
        await client.end()
    }
    
}
// insertData()

//#fetch data
// import {Client} from "pg";

async function getData(email: string){
    const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")

    try {
        await client.connect()
        //#naive approach
        // const result = await client.query(`SELECT * FROM users WHERE email = '${email}'`)
        //#better approach
        const result = await client.query('SELECT * FROM users WHERE email = $1',[email])
        console.log("data  ",result.rows)
        
    } catch (error) {
        console.log('error while getting email table : error ',error)
    }finally{
        await client.end()
    }
    
}
// getData('alfed@22')

// import {Client} from "pg";

async function preventSQLInjection(){
    const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")

    try {
        await client.connect()
        const insertQuery = 'INSERT INTO users (username,email,password) VALUES ($1,$2,$3)'
        const result = await client.query(insertQuery,['harkirat','harkirat@gmail.com','harkirat@123'])
        console.log('data',result)
    } catch (error) {
        console.log(' error ',error)
    }finally{
        await client.end()
    }
    
}
// preventSQLInjection()

// import {Client}  from 'pg';
const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")

async function deleteTable(){
    await client.connect()
    try {
        const deleteQuery = "DROP TABLE users"
        const response = await client.query(deleteQuery)
        console.log("users table dropped successfully : ",response) 
    } catch (error) {
        console.log("error : ",error)
    }finally{
        await client.end()
    }
}
deleteTable()