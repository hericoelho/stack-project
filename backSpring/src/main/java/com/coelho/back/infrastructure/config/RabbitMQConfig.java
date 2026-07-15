package com.coelho.back.infrastructure.config;

import org.springframework.amqp.core.*;
import org.springframework.amqp.rabbit.connection.ConnectionFactory;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.amqp.support.converter.Jackson2JsonMessageConverter;
import org.springframework.amqp.support.converter.MessageConverter;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.retry.annotation.EnableRetry;

import org.springframework.amqp.core.Queue;

@Configuration
@EnableRetry
public class RabbitMQConfig {

	public static final String QUEUE_NAME = "activity.status.changed";

	public static final String EXCHANGE_NAME = "activity.exchange";

	public static final String ROUTING_KEY = "activity.status.changed";

	@Bean
	public Queue activityStatusQueue() {
		return QueueBuilder.durable(QUEUE_NAME).build();
	}

	@Bean
	public TopicExchange activityExchange() {
		return ExchangeBuilder.topicExchange(EXCHANGE_NAME).durable(true).build();
	}

	@Bean
	public Binding binding(Queue queue, TopicExchange exchange) {
		return BindingBuilder.bind(queue).to(exchange).with(ROUTING_KEY);
	}

	@Bean
	public MessageConverter jsonConverter() {
		return new Jackson2JsonMessageConverter();
	}

	@Bean
	public RabbitTemplate rabbitTemplate(ConnectionFactory cf, MessageConverter converter) {
		RabbitTemplate template = new RabbitTemplate(cf);
		template.setMessageConverter(converter);
		return template;
	}

}
