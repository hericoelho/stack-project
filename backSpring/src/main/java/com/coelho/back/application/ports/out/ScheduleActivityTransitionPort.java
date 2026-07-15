package com.coelho.back.application.ports.out;

import java.time.Duration;

public interface ScheduleActivityTransitionPort {

	void schedule(String activityId, Duration delay);

}
