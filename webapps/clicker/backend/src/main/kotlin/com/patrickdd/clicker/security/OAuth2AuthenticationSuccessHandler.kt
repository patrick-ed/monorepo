package com.patrickdd.clicker.security

import com.patrickdd.clicker.entity.Click
import com.patrickdd.clicker.entity.User
import com.patrickdd.clicker.repository.UserRepository
import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import org.springframework.beans.factory.annotation.Value
import org.springframework.security.core.Authentication
import org.springframework.security.oauth2.core.user.OAuth2User
import org.springframework.security.web.authentication.SimpleUrlAuthenticationSuccessHandler
import org.springframework.stereotype.Component
import org.springframework.web.util.UriComponentsBuilder

@Component
class OAuth2AuthenticationSuccessHandler(
    private val tokenProvider: JwtTokenProvider,
    private val userRepository: UserRepository,
    @Value("\${app.oauth2.authorized-redirect-uri}") private val redirectUri: String
) : SimpleUrlAuthenticationSuccessHandler() {

    override fun onAuthenticationSuccess(
        request: HttpServletRequest,
        response: HttpServletResponse,
        authentication: Authentication
    ) {
        val oauth2User = authentication.principal as OAuth2User
        val email = oauth2User.attributes["email"] as String

        val user = userRepository.findByEmail(email).orElseGet {
            // Create new user if not exists
            val newUser = User(
                googleId = oauth2User.attributes["sub"] as String,
                email = email,
                firstName = oauth2User.attributes["given_name"] as String,
                lastName = oauth2User.attributes["family_name"] as String
            )
            // Create initial clicks entry for the new user
            newUser.clicks = Click(user = newUser, count = 0)
            userRepository.save(newUser)
        }

        val token = tokenProvider.generateToken(user)
        val targetUrl = UriComponentsBuilder.fromUriString(redirectUri)
            .queryParam("token", token)
            .build().toUriString()

        clearAuthenticationAttributes(request)
        redirectStrategy.sendRedirect(request, response, targetUrl)
    }
}