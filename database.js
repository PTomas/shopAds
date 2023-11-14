import mysql from 'mysql2';
import dotenv from 'dotenv';
dotenv.config();

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
}).promise()

export async function getUsers(){
    const [rows] = await pool.query("SELECT * FROM users");
    return rows
}

const users = await getUsers();
console.log(users);

export async function selectUser(email, password){
    const [rows] = await pool.query(`
    SELECT *
    FROM users 
    WHERE email = ? AND password = ?
    `, [email, password])
    return rows[0]
}

export async function createUser(name, email, password) {
    const result = await pool.query(`
    INSERT INTO users (name, email, password)
    VALUES (?, ?, ?)
    `, [name, email, password])
    return result;
}