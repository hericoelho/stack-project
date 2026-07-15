package com.coelho.back.infrastructure.adapters.out.rabbitmq;

import com.coelho.back.application.ports.out.ActivityEventPublisherPort;
import com.coelho.back.domain.model.Activity;
import com.coelho.back.domain.model.ActivityStatus;
import com.coelho.back.infrastructure.config.RabbitMQConfig;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.amqp.rabbit.core.RabbitTemplate;
import org.springframework.retry.annotation.Backoff;
import org.springframework.retry.annotation.Recover;
import org.springframework.retry.annotation.Retryable;

import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class RabbitMQActivityEventPublisher implements ActivityEventPublisherPort {

	private final RabbitTemplate rabbitTemplate;

	@Retryable(retryFor = { Exception.class }, maxAttempts = 3, backoff = @Backoff(delay = 2000, multiplier = 2))
	@Override
	public void publish(Activity activity) {
		var message = new ActivityStatusChangedMessage(activity.id(), activity.title(), activity.status(),
				Instant.now());

		rabbitTemplate.convertAndSend(RabbitMQConfig.EXCHANGE_NAME, RabbitMQConfig.ROUTING_KEY, message);

		log.info("Published activity status change to RabbitMQ: activityId={}, to new status: {}", activity.id(),
				activity.status());
	}

	@Recover
	public void recover(Exception ex, Activity activity) {
		log.error("Failed to publish activity status change after retries. "
				+ "activityId={}, to new status: {}. Message lost.", activity.id(), activity.status(), ex);
	}

}
