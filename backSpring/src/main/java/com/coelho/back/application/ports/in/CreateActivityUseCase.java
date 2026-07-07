package com.coelho.back.application.ports.in;

import com.coelho.back.domain.model.Activity;

public interface CreateActivityUseCase {
    Activity execute(Activity activity);
}
