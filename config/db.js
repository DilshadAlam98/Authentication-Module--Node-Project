import pg from "pg";


// const createDatabaseQuery = `CREATE DATABASE ${process.env.PGDATABASE};`;
// const checkDatabaseQuery = `SELECT datname FROM dilshad WHERE id = $1;`;


const client = async () => {
    const pool = new pg.Pool({
        user: process.env.PGUSER,
        host: process.env.PGHOST,
        database: "master_user",
        password: process.env.PGPASSWORD,
        port: process.env.PGPORT
    })
    return pool;
}

const databaseClient = await client();
const connectToDatabase = async () => {

    await databaseClient.connect().then(async (e) => {
        console.log(`Database ${process.env.PGDATABASE} connected`);

    }).catch(err => {
        console.error('Error creating database:', err);

    })


}


export { connectToDatabase, databaseClient }