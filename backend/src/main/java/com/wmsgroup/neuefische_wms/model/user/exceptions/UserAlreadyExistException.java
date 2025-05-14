package com.wmsgroup.neuefische_wms.model.user.exceptions;

public class UserAlreadyExistException extends RuntimeException {
  public UserAlreadyExistException(String message) {
    super(message);
  }
}
