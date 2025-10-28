package com.example.restservice.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import com.example.restservice.exception.JwtAuthException;




import java.security.Key;
import java.util.Date;

@Component
public class JwtUtil {

    private final Key key;
    private final long expirationMs;

    public JwtUtil(@Value("${app.jwt.secret:ChangeThisSecretToAStrongRandomValue}") String secret,
                   @Value("${app.jwt.expiration-ms:3600000}") long expirationMs) {
        // build key from secret (must be sufficiently long)
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.expirationMs = expirationMs;
    }

    public String generateToken(Long userId) {
        Date now = new Date();
        Date exp = new Date(now.getTime() + expirationMs);
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .setIssuedAt(now)
                .setExpiration(exp)
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long validateTokenAndGetUserId(String token) {
        if (token == null || token.isBlank()) throw new JwtAuthException();
        try {
            Jws<Claims> claimsJws = Jwts.parserBuilder()
                    .setSigningKey(key)
                    .build()
                    .parseClaimsJws(token);
            String subject = claimsJws.getBody().getSubject();
            return Long.parseLong(subject);
        } catch (JwtException | IllegalArgumentException e) {
            throw new JwtAuthException();
        }
    }
}
