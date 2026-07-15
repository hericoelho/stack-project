package com.coelho.back.application.ports.in;

import com.coelho.back.domain.model.Activity;

import java.util.List;

public interface ListActivitiesUseCase {

	List<Activity> execute();

}
