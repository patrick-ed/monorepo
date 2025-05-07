package com.patrickdd.fullstackproject.controller

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import org.springframework.beans.factory.annotation.Value
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/login")
class AuthController(
    @Value("\${app.url.frontend}") private val FRONTEND_URL: String,
    @Value("\${app.url.backend}") private val BACKEND_URL: String
) {

    private val clientId = "1076665635299-lc6vi29cic3f8ldptptpp59fs17eu031.apps.googleusercontent.com"
    private val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory.getDefaultInstance())
        .setAudience(Collections.singletonList(clientId))
        .build()

    @PostMapping
    fun loginWithGoogle(@RequestParam("credential") token: String): ResponseEntity<Map<String, String>> {
        val idToken: GoogleIdToken? = verifier.verify(token)

        return if (idToken != null) {
            val payload = idToken.payload
            val email = payload.email
            val name = payload["name"] as String
            val picture = payload["picture"] as String?

            val response = mapOf(
                "status" to "success",
                "email" to email,
                "name" to name,
                "picture" to (picture ?: ""),
                "token" to token
            )

            ResponseEntity.ok(response)
        } else {
            throw IllegalArgumentException("Invalid ID token.")
        }
    }
}