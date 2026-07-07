package com.coelho.back.infrastructure.adapters.in.web.dto;

import com.coelho.back.domain.model.Activity;
import com.coelho.back.domain.model.ActivityStatus;
import com.coelho.back.domain.model.ActivityType;

import java.time.Instant;

public record ActivityResponse(
        String id,
        String title,
        String description,
        ActivityType type,
        ActivityStatus status,
        Instant createdAt
) {
    public static ActivityResponse fromDomain(Activity activity) {
        return new ActivityResponse(
                activity.id(), activity.title(), activity.description(),
                activity.type(), activity.status(), activity.createdAt()
        );
    }
}