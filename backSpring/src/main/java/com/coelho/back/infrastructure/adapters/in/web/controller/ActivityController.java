package com.coelho.back.infrastructure.adapters.in.web.controller;

import com.coelho.back.application.ports.in.CreateActivityUseCase;
import com.coelho.back.application.ports.in.ListActivitiesUseCase;
import com.coelho.back.infrastructure.adapters.in.web.dto.ActivityResponse;
import com.coelho.back.infrastructure.adapters.in.web.dto.CreateActivityRequest;
import com.coelho.back.infrastructure.mapper.ActivityMapper;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/v1/activities")
@RequiredArgsConstructor
public class ActivityController {

	private final CreateActivityUseCase createActivityUseCase;

	private final ListActivitiesUseCase listActivitiesUseCase;

	private final ActivityMapper activityMapper;

	@PostMapping
	public ResponseEntity<ActivityResponse> create(@RequestBody @Valid CreateActivityRequest request) {
		var activity = activityMapper.toDomain(request);
		var saved = createActivityUseCase.execute(activity);
		return ResponseEntity.status(HttpStatus.CREATED).body(activityMapper.toResponse(saved));
	}

	@GetMapping
	public ResponseEntity<List<ActivityResponse>> list() {
		var activities = listActivitiesUseCase.execute();
		var response = activities.stream().map(activityMapper::toResponse).toList();
		return ResponseEntity.ok(response);
	}

}
