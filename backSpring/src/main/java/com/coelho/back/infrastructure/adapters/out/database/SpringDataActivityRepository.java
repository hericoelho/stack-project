package com.coelho.back.infrastructure.adapters.out.database;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SpringDataActivityRepository extends MongoRepository<ActivityDocument, String> {

}
