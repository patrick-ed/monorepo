package com.patrickdd.clicker.security

import com.patrickdd.clicker.entity.User
import io.jsonwebtoken.Claims
import io.jsonwebtoken.Jwts
import io.jsonwebtoken.security.Keys
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Component
import java.util.*
import javax.crypto.SecretKey

@Component
class JwtTokenProvider(
    @Value("\${app.jwt.secret}") private val jwtSecret: String,
    @Value("\${app.jwt.expiration-ms}") private val jwtExpirationMs: Long
) {
    private val key: SecretKey = Keys.hmacShaKeyFor(jwtSecret.toByteArray())

    fun generateToken(user: User): String {
        val now = Date()
        val expiryDate = Date(now.time + jwtExpirationMs)

        return Jwts.builder()
            .subject(user.id.toString())
            .issuedAt(now)
            .expiration(expiryDate)
            .signWith(key)
            .compact()
    }

    fun getUserIdFromJWT(token: String): UUID {
        val claims: Claims = Jwts.parser()
            .verifyWith(key)
            .build()
            .parseSignedClaims(token)
            .payload

        return UUID.fromString(claims.subject)
    }

    fun validateToken(authToken: String): Boolean {
        try {
            Jwts.parser().verifyWith(key).build().parseSignedClaims(authToken)
            return true
        } catch (ex: Exception) {
            // Log exception (e.g., SignatureException, MalformedJwtException, ExpiredJwtException)
        }
        return false
    }
}