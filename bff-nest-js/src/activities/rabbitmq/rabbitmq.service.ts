import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import type { Channel, ConsumeMessage } from 'amqplib';
import * as amqpConnectionManager from 'amqp-connection-manager';

@Injectable()
export class RabbitmqService implements OnModuleInit {
  private readonly logger = new Logger(RabbitmqService.name);
  private readonly QUEUE = 'activity.status.changed';
  private readonly EXCHANGE = 'activity.exchange';
  private readonly ROUTING_KEY = 'activity.status.changed';

  onModuleInit() {
    const host = process.env.RABBITMQ_HOST || 'localhost';
    const user = process.env.RABBITMQ_USER || 'rabbitUser';
    const pass = process.env.RABBITMQ_PASS || 'rabbitPwd';

    const connection = amqpConnectionManager.connect(
      [`amqp://${user}:${pass}@${host}:5672`],
      { reconnectTimeInSeconds: 5 },
    );

    connection.createChannel({
      setup: async (ch: Channel) => {
        await ch.assertExchange(this.EXCHANGE, 'topic', { durable: true });
        await ch.assertQueue(this.QUEUE, { durable: true });
        await ch.bindQueue(this.QUEUE, this.EXCHANGE, this.ROUTING_KEY);
        await ch.consume(this.QUEUE, (msg: ConsumeMessage | null) => {
          if (msg) {
            const content = JSON.parse(msg.content.toString()) as Record<
              string,
              unknown
            >;
            this.logger.log(`Received: ${JSON.stringify(content)}`);
            ch.ack(msg);
          }
        });
      },
    });

    this.logger.log(`Consuming from queue: ${this.QUEUE}`);
  }
}
