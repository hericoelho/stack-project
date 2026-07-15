package com.coelho.back.application.usecase;

import com.coelho.back.application.ports.in.CreateActivityUseCase;
import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.application.ports.out.ScheduleActivityTransitionPort;
import com.coelho.back.domain.model.Activity;
import lombok.RequiredArgsConstructor;

import java.time.Duration;

@RequiredArgsConstructor
public class CreateActivityUseCaseImpl implements CreateActivityUseCase {

	private final ActivityRepositoryPort repository;

	private final ScheduleActivityTransitionPort scheduler; // NOVO

	private final Duration transitionDelay;

	@Override
	public Activity execute(Activity activity) {
		var saved = repository.save(activity);
		scheduler.schedule(saved.id(), transitionDelay);
		return saved;
	}

}
