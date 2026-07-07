package com.coelho.back.infrastructure.adapters.out.database;

import com.coelho.back.domain.model.Activity;
import com.coelho.back.domain.model.ActivityStatus;
import com.coelho.back.domain.model.ActivityType;
import lombok.*;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "activities")
@Getter
@ToString
@EqualsAndHashCode
@NoArgsConstructor
@AllArgsConstructor
public class ActivityDocument {

    @Id
    private String id;
    private String title;
    private String description;
    private ActivityType type;
    private ActivityStatus status;
    private Instant createdAt;

    public static ActivityDocument fromDomain(Activity activity) {
        return new ActivityDocument(
                activity.id(),
                activity.title(),
                activity.description(),
                activity.type(),
                activity.status(),
                activity.createdAt()
        );
    }

    public Activity toDomain() {
        return new Activity(id, title, description, type, status, createdAt);
    }
}