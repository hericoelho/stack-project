package com.coelho.back.domain.model;

import java.time.Instant;

public record Activity(String id, String title, String description, ActivityType type, ActivityStatus status,
		Instant createdAt) {
	public static Activity create(String title, String description, ActivityType type) {
		return new Activity(null, title, description, type, ActivityStatus.PREPARING, Instant.now());
	}

	public Activity withStatus(ActivityStatus newStatus) {
		return new Activity(id, title, description, type, newStatus, createdAt);
	}
}