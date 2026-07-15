package com.coelho.back.application.usecase;

import com.coelho.back.application.ports.in.ListActivitiesUseCase;
import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.domain.model.Activity;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class ListActivitiesUseCaseImpl implements ListActivitiesUseCase {

	private final ActivityRepositoryPort repository;

	@Override
	public List<Activity> execute() {
		return repository.findAll();
	}

}
