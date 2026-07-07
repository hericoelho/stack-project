package com.coelho.back.infrastructure.adapters.out.database;

import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.domain.model.Activity;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
@RequiredArgsConstructor
public class ActivityRepositoryAdapter implements ActivityRepositoryPort {

    private final SpringDataActivityRepository  repository;

    @Override
    public Activity save(Activity activity) {
        var document = ActivityDocument.fromDomain(activity);
        var saved = repository.save(document);
        return saved.toDomain();
    }

    @Override
    public List<Activity> findAll() {
        return repository.findAll().stream().map(ActivityDocument::toDomain).toList();
    }
}
