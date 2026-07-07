package com.coelho.back.application.ports.out;

import com.coelho.back.domain.model.Activity;

import java.util.List;

public interface ActivityRepositoryPort {
    Activity save(Activity activity);
    List<Activity> findAll();
}
