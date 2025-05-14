package com.wmsgroup.neuefische_wms.model.user.exceptions;

public class UserExistException extends RuntimeException {
  public UserExistException(String message) {
    super(message);
  }
}
