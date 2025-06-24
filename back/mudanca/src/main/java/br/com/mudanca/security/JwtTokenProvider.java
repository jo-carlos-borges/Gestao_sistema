package br.com.mudanca.security;

import java.sql.Date; 
import java.time.Instant;
import java.time.temporal.ChronoUnit;

import javax.crypto.SecretKey;

import org.springframework.stereotype.Component;
import org.springframework.beans.factory.annotation.Value;

import br.com.mudanca.model.User;
import io.jsonwebtoken.JwtException;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.security.Keys;


@Component
public class JwtTokenProvider {
	
    @Value("${app.jwt.secret}")
    private String jwtSecret;

    @Value("${app.jwt.expiration}")
    private int jwtExpirationMs;

    private SecretKey getSigningKey() {
        return Keys.hmacShaKeyFor(jwtSecret.getBytes());
    }

    public String generateToken(User user) {
        Instant now = Instant.now();
        Instant expiration = now.plus(jwtExpirationMs, ChronoUnit.MILLIS);

        return Jwts.builder()
            .subject(user.getId().toString())
            .issuedAt(Date.from(now))
            .expiration(Date.from(expiration)) 
            .signWith(getSigningKey(), Jwts.SIG.HS512)
            .compact();
    }

    public Long getUserIdFromJWT(String token) {
        return Long.parseLong(Jwts.parser()
            .verifyWith(getSigningKey())
            .build()
            .parseSignedClaims(token)
            .getPayload()
            .getSubject());
    }

    public boolean validateToken(String authToken) {
        try {
            Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parse(authToken);
            return true;
        } catch (JwtException | IllegalArgumentException ex) {
            return false;
        }
    }
}