package com.coelho.back.application.ports.out;

import com.coelho.back.domain.model.Activity;
import com.coelho.back.domain.model.ActivityStatus;

public interface ActivityEventPublisherPort {

	void publish(Activity activity);

}
