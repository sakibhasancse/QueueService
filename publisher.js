const amqplib = require('amqplib');
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

(async () => {
    const connection = await amqplib.connect(amqpUrl, 'heartbeat=60');
    const channel = await connection.createChannel();
    try {
        console.log('Publishing');
        const exchange = 'user.signed_up';
        const queue = 'user.sign_up_email';
        const routingKey = 'sign_up_email';

        await channel.assertExchange(exchange, 'direct', {durable: true});
        await channel.assertQueue(queue, {durable: true});
        await channel.bindQueue(queue, exchange, routingKey);

        const user = {id: Math.floor(Math.random() * 1000), email: 'me.sakib20@gmail.com', password: '13121', name:"sakib"}
        await channel.publish(exchange, routingKey, Buffer.from(JSON.stringify(user)))
        console.log('Message published');
    } catch (e) {
        console.log('error'.e)
    } finally {
        await channel.close();
        await connection.close();
        console.info('Channel and connection closed');
    }
    process.exit(0);
})();