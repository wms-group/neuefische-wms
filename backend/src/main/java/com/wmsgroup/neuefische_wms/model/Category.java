package com.wmsgroup.neuefische_wms.model;

import com.mongodb.lang.Nullable;
import lombok.Builder;
import lombok.Getter;
import lombok.NonNull;
import lombok.With;
import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document
@Builder
@With
@Getter
public class Category {
    @Id
    private final String id;
    @Nullable
    private final String parentId;
    @NonNull
    private final String name;
}
