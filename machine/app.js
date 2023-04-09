import * as mqtt from 'mqtt';

const client = mqtt.connect(`mqtt://mosquitto-broker:2883`);
client.on('connect', () => {
    console.log('Connected to MQTT broker');
    setInterval(() => {
        const temperature = Math.floor(Math.random() * 100);
        console.log(`Sending message: ${temperature}`);
        client.publish('temperature/room1', JSON.stringify({ temperature }));
    }, 5000);
});
