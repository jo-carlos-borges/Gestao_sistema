package br.com.mudanca.dto;

public record AuthenticationResponse(
	    String token,
	    UserResponse user
) {}
