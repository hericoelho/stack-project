package com.coelho.back.application.ports.out;

import com.coelho.back.domain.model.Activity;

import java.util.List;
import java.util.Optional;

public interface ActivityRepositoryPort {

	Activity save(Activity activity);

	List<Activity> findAll();

	Optional<Activity> findById(String id);

}
