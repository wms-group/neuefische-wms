package com.wmsgroup.neuefische_wms.model.user;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import org.springframework.data.mongodb.core.index.Indexed;

@Document("Users")
public record User(
        @Id String id,
        @Indexed(unique = true)
        String username,
        String name,
        UserRole role,
        String password) {
}
