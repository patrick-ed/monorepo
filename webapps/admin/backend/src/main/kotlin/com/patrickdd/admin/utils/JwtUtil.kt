package com.patrickdd.admin.utils

import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.Date
import javax.crypto.SecretKey

@Component
class JwtUtil {

    @Value("\${jwt.secret}")
    private lateinit var secret: String

    @Value("\${jwt.expiration}")
    private lateinit var expirationTime: String

    // The key used for signing the JWT. It's derived from the secret string.
    private val key: SecretKey by lazy {
        Keys.hmacShaKeyFor(secret.toByteArray())
    }

    /**
     * Generates a JWT for a given username.
     */
    fun generateToken(username: String): String {
        val expirationMillis = System.currentTimeMillis() + expirationTime.toLong()
        return Jwts.builder()
            .subject(username)
            .issuedAt(Date())
            .expiration(Date(expirationMillis))
            .signWith(key)
            .compact()
    }

    /**
     * Validates a JWT. Returns true if the token is valid, false otherwise.
     */
    fun validateToken(token: String): Boolean {
        return try {
            !isTokenExpired(token)
        } catch (e: Exception) {
            // Catches any exception during parsing (e.g., malformed, expired, signature error)
            false
        }
    }

    /**
     * Extracts the username (subject) from a given token.
     */
    fun extractUsername(token: String): String? {
        return try {
            extractAllClaims(token).subject
        } catch (e: Exception) {
            null
        }
    }

    private fun isTokenExpired(token: String): Boolean {
        val expiration = extractAllClaims(token).expiration
        return expiration.before(Date())
    }

    private fun extractAllClaims(token: String): Claims {
        return Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload
    }
}