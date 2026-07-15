package com.coelho.back.infrastructure.adapters.out.scheduler;

import com.coelho.back.application.ports.in.UpdateActivityStatusUseCase;
import com.coelho.back.application.ports.out.ScheduleActivityTransitionPort;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.TaskScheduler;
import org.springframework.stereotype.Component;

import java.time.Duration;
import java.time.Instant;

@Slf4j
@Component
@RequiredArgsConstructor
public class TaskSchedulerActivityTransitionAdapter implements ScheduleActivityTransitionPort {

	private final TaskScheduler taskScheduler;

	private final UpdateActivityStatusUseCase updateActivityStatusUseCase;

	@Override
	public void schedule(String activityId, Duration delay) {
		var executionTime = Instant.now().plus(delay);
		log.info("Scheduling status transition for activity {} at {} (delay={})", activityId, executionTime, delay);

		taskScheduler.schedule(() -> updateActivityStatusUseCase.execute(activityId), executionTime);

	}

}
