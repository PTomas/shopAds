import mysql from 'mysql2';

const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "Runningtree2",
    database: "shopusersDB",
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