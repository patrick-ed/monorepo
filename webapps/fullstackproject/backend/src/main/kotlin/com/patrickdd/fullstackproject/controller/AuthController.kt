package com.patrickdd.fullstackproject.controller

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.client.json.gson.GsonFactory
import com.patrickdd.fullstackproject.model.User
import com.patrickdd.fullstackproject.repository.UserRepository
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
    @Value("\${app.url.backend}") private val BACKEND_URL: String,
    private val userRepository: UserRepository,
) {

    private val clientId = "1076665635299-lc6vi29cic3f8ldptptpp59fs17eu031.apps.googleusercontent.com"
    private val verifier = GoogleIdTokenVerifier.Builder(NetHttpTransport(), GsonFactory.getDefaultInstance())
        .setAudience(Collections.singletonList(clientId))
        .build()



    @PostMapping
    fun loginWithGoogle(
        @RequestParam("credential") token: String,
    ): ResponseEntity<Map<String, String>> {
        val idToken: GoogleIdToken? = verifier.verify(token)

        return if (idToken != null) {
            val payload = idToken.payload
            val email = payload.email
            val firstname = payload["given_name"] as String
            val lastname = payload["family_name"] as String
            val picture = payload["picture"] as String?
            var status = "success"

            if(!userRepository.existsById(email)){
                val user = User(
                    email = email,
                    firstname = firstname,
                    lastname = lastname
                )
                status = "success - added to database"
                userRepository.save<User>(user)
            }

            val response = mapOf(
                "status" to status,
                "email" to email,
                "firstname" to firstname,
                "lastname" to lastname,
                "picture" to (picture ?: ""),
                "token" to token
            )

            ResponseEntity.ok(response)
        } else {
            throw IllegalArgumentException("Invalid ID token.")
        }
    }
}