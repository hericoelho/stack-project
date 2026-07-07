package com.coelho.back.application.usecase;

import com.coelho.back.application.ports.in.CreateActivityUseCase;
import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.domain.model.Activity;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
public class CreateActivityUseCaseImpl implements CreateActivityUseCase {

    private final ActivityRepositoryPort repository;

    @Override
    public Activity execute(Activity activity) {
        return repository.save(activity);
    }
}
