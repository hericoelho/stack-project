package com.coelho.back.infrastructure.config;

import com.coelho.back.application.ports.in.CreateActivityUseCase;
import com.coelho.back.application.ports.in.ListActivitiesUseCase;
import com.coelho.back.application.ports.in.UpdateActivityStatusUseCase;
import com.coelho.back.application.ports.out.ActivityEventPublisherPort;
import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.application.ports.out.ScheduleActivityTransitionPort;
import com.coelho.back.application.usecase.CreateActivityUseCaseImpl;
import com.coelho.back.application.usecase.ListActivitiesUseCaseImpl;
import com.coelho.back.application.usecase.UpdateActivityStatusUseCaseImpl;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.Duration;

@Configuration
public class UseCaseConfig {

	@Value("${activity.status.transition.delay-ms:120000}")
	private long transitionDelayMs;

	@Bean
	public CreateActivityUseCase createActivityUseCase(ActivityRepositoryPort repository,
			ScheduleActivityTransitionPort scheduler) {
		return new CreateActivityUseCaseImpl(repository, scheduler, Duration.ofMillis(transitionDelayMs));
	}

	@Bean
	public ListActivitiesUseCase listActivitiesUseCase(ActivityRepositoryPort repository) {
		return new ListActivitiesUseCaseImpl(repository);
	}

	@Bean
	public UpdateActivityStatusUseCase updateActivityStatusUseCase(ActivityRepositoryPort repository,
			ActivityEventPublisherPort eventPublisher) {
		return new UpdateActivityStatusUseCaseImpl(repository, eventPublisher);
	}

}