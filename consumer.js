const amqplib = require('amqplib');
const processMessage = require("./processMessage");
const amqpUrl = process.env.AMQP_URL || 'amqp://localhost:5673';

(async ()=>{
    const connection = await amqplib.connect(amqpUrl, "heartbeat=60")
    const channel = await connection.createChannel();
    channel.prefetch(10);
    const queue = 'user.sign_up_email';

    process.once('SIGINT', async () => {
        console.log('got sigint, closing connection');
        await channel.close();
        await connection.close();
        process.exit(0);
    });

    await channel.assertQueue(queue, {durable: true})
    await channel.consume(queue, async (msg)=>{
        console.log({msg: JSON.parse(msg.content)})
        console.log({msg})
        await processMessage(msg)
        await channel.ack(msg)
    })
    console.log(" [*] Waiting for messages. To exit press CTRL+C");
})()