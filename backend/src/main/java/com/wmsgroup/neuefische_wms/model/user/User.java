package com.wmsgroup.neuefische_wms.model.user;

import org.springframework.data.annotation.Id;

public record User(@Id String id, String name, UserRole role, String password) {
}
