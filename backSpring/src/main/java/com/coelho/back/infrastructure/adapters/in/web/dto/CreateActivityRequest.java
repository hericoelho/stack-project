package com.coelho.back.infrastructure.adapters.in.web.dto;

import com.coelho.back.domain.model.ActivityType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CreateActivityRequest(@NotBlank String title, String description, @NotNull ActivityType type) {
}