"use strict";
//# Create Table
// import {Client} from "pg";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
// async function createUserTable(){
//     const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")
//     try {
//         await client.connect()
//         const result = await client.query(`
//             CREATE TABLE users(
//                 id SERIAL PRIMARY KEY,
//                 username VARCHAR(25) UNIQUE NOT NULL,
//                 email VARCHAR(50) UNIQUE NOT NULL,
//                 password VARCHAR(50) NOT NULL,
//                 createdAt TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
//             );
//             `)
//         console.log("table created ",result)
//     } catch (error) {
//         console.log('error while creating table : error ',error)
//     }finally{
//         await client.end()
//     }
// }
// createUserTable()
//#Insert data
// import {Client} from "pg";
// async function insertData(){
//     const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")
//     try {
//         await client.connect()
// const result = await client.query(`
//     INSERT INTO users(username,email,password) VALUES ('alfed','alfed@22','alfedKhan333')
//             `)
//         console.log("data inserted ",result)
//     } catch (error) {
//         console.log('error while inserting table : error ',error)
//     }finally{
//         await client.end()
//     }
// }
// insertData()
//#fetch data
// import {Client} from "pg";
// async function getData(email: string){
//     const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")
//     try {
//         await client.connect()
//         //#naive approach
//         // const result = await client.query(`SELECT * FROM users WHERE email = '${email}'`)
//         //#better approach
//         const result = await client.query('SELECT * FROM users WHERE email = $1',[email])
//         console.log("data  ",result.rows)
//     } catch (error) {
//         console.log('error while getting email table : error ',error)
//     }finally{
//         await client.end()
//     }
// }
// getData('alfed@22')
// import {Client} from "pg";
// async function preventSQLInjection(){
//     const client = new Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require")
//     try {
//         await client.connect()
//         const insertQuery = 'INSERT INTO users (username,email,password) VALUES ($1,$2,$3)'
//         const result = await client.query(insertQuery,['sfsdkfhds','sfgsdhfsdjff','sdjfhdffj'])
//         console.log('data',result)
//     } catch (error) {
//         console.log(' error ',error)
//     }finally{
//         await client.end()
//     }
// }
// preventSQLInjection()
const pg_1 = require("pg");
const client = new pg_1.Client("postgresql://neondb_owner:npg_QxS8srXej1Cq@ep-shiny-union-a8hscdao-pooler.eastus2.azure.neon.tech/neondb?sslmode=require");
function deleteTable() {
    return __awaiter(this, void 0, void 0, function* () {
        yield client.connect();
        try {
            const deleteQuery = "DROP TABLE users";
            const response = yield client.query(deleteQuery);
            console.log(response);
        }
        catch (error) {
            console.log("error : ", error);
        }
        finally {
            yield client.end();
        }
    });
}
deleteTable();
