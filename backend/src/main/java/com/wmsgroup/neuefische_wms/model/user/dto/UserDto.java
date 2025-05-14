package com.wmsgroup.neuefische_wms.model.user.dto;

import com.wmsgroup.neuefische_wms.model.user.UserRole;

public record UserDto(String username, String name, UserRole role) {
}
