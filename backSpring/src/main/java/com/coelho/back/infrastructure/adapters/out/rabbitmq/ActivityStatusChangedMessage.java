package com.coelho.back.infrastructure.adapters.out.rabbitmq;

import com.coelho.back.domain.model.ActivityStatus;

import java.time.Instant;

public record ActivityStatusChangedMessage(String activityId, String title, ActivityStatus newStatus,
		Instant timestamp) {
}
