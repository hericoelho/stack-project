package com.coelho.back.application.usecase;

import com.coelho.back.application.ports.in.UpdateActivityStatusUseCase;
import com.coelho.back.application.ports.out.ActivityEventPublisherPort;
import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.domain.model.ActivityStatus;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Slf4j
@RequiredArgsConstructor
public class UpdateActivityStatusUseCaseImpl implements UpdateActivityStatusUseCase {

	private final ActivityRepositoryPort repository;

	private final ActivityEventPublisherPort eventPublisher;

	@Override
	public void execute(String activityId) {
		repository.findById(activityId).ifPresent(activity -> {
			if (activity.status() != ActivityStatus.PREPARING) {
				log.warn("Activity {} status is {}, expected PREPARING. Skipping.", activityId, activity.status());
				return;
			}

			var updated = activity.withStatus(ActivityStatus.PLAN);
			repository.save(updated);
			log.info("Activity {} transitioned from {} to {}", activityId, ActivityStatus.PREPARING,
					ActivityStatus.PLAN);

			eventPublisher.publish(updated);
		});
	}

}
