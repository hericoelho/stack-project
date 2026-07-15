package com.coelho.back.infrastructure.mapper;

import com.coelho.back.domain.model.Activity;
import com.coelho.back.infrastructure.adapters.in.web.dto.ActivityResponse;
import com.coelho.back.infrastructure.adapters.in.web.dto.CreateActivityRequest;
import com.coelho.back.infrastructure.adapters.out.database.ActivityDocument;
import org.springframework.stereotype.Component;

@Component
public class ActivityMapper {

	public Activity toDomain(CreateActivityRequest request) {
		return Activity.create(request.title(), request.description(), request.type());
	}

	public ActivityResponse toResponse(Activity activity) {
		return ActivityResponse.fromDomain(activity);
	}

}