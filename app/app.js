import * as mqtt from 'mqtt';
import mysql2 from 'mysql2';

const client = mqtt.connect(`mqtt://mosquitto-broker:2883`);

const connection = mysql2.createConnection({
    host: 'database-mysql',
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT,
});

client.on('connect', () => {
    console.log('Connected to MQTT broker');
    client.subscribe('temperature/#')
});

client.on('message', (topic, message) => {
    const parsedData = JSON.parse(message.toString());
    const currentTemperature = parsedData.temperature;

    const sql = `INSERT INTO temperature (topic, value, datetime) VALUES (?, ?, ?)`;
    const values = [topic, currentTemperature, new Date()];

    connection.query(sql, values, (err, res, fields) => {
        if (err) {
            console.error(err);
        } else {
            console.log(`New record is inserted, ${res.insertId}`);
        }
    })
})