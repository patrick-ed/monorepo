package com.patrickdd.fullstackproject.service

import io.jsonwebtoken.Jwts
import io.jsonwebtoken.SignatureAlgorithm
import io.jsonwebtoken.security.Keys
import org.springframework.stereotype.Service
import java.util.Date
import javax.crypto.SecretKey

@Service
class JwtService {

    private val secretKey: SecretKey = Keys.secretKeyFor(SignatureAlgorithm.HS256)

    fun createToken(email: String): String {
        val now = Date()
        val expiryDate = Date(now.time + 1000 * 60 * 60 * 24) // 24 hours

        return Jwts.builder()
            .setSubject(email)
            .setIssuedAt(now)
            .setExpiration(expiryDate)
            .signWith(secretKey)
            .compact()
    }

    fun validateToken(token: String): String? {
        return try {
            val claims = Jwts.parserBuilder()
                .setSigningKey(secretKey)
                .build()
                .parseClaimsJws(token)
            claims.body.subject
        } catch (e: Exception) {
            null
        }
    }
}