package com.coelho.back.infrastructure.config;

import com.coelho.back.application.ports.in.CreateActivityUseCase;
import com.coelho.back.application.ports.in.ListActivitiesUseCase;
import com.coelho.back.application.ports.out.ActivityRepositoryPort;
import com.coelho.back.application.usecase.CreateActivityUseCaseImpl;
import com.coelho.back.application.usecase.ListActivitiesUseCaseImpl;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class UseCaseConfig {

    @Bean
    public CreateActivityUseCase createActivityUseCase(ActivityRepositoryPort repository) {
        return new CreateActivityUseCaseImpl(repository);
    }

    @Bean
    public ListActivitiesUseCase listActivitiesUseCase(ActivityRepositoryPort repository) {
        return new ListActivitiesUseCaseImpl(repository);
    }
}