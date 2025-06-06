package com.patrickdd.clicker.config

import com.patrickdd.clicker.security.JwtAuthenticationFilter
import com.patrickdd.clicker.security.OAuth2AuthenticationSuccessHandler
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.security.config.annotation.web.builders.HttpSecurity
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity
import org.springframework.security.config.http.SessionCreationPolicy
import org.springframework.security.web.SecurityFilterChain
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter
import org.springframework.web.cors.CorsConfiguration
import org.springframework.web.cors.CorsConfigurationSource
import org.springframework.web.cors.UrlBasedCorsConfigurationSource

@Configuration
@EnableWebSecurity
class SecurityConfig(
    private val oAuth2AuthenticationSuccessHandler: OAuth2AuthenticationSuccessHandler,
    private val jwtAuthenticationFilter: JwtAuthenticationFilter
) {

    @Bean
    fun securityFilterChain(http: HttpSecurity): SecurityFilterChain {
        http
            .cors { it.configurationSource(corsConfigurationSource()) }
            .csrf { it.disable() }
            .sessionManagement { it.sessionCreationPolicy(SessionCreationPolicy.STATELESS) }
            .formLogin { it.disable() }
            .httpBasic { it.disable() }
            .authorizeHttpRequests { auth ->
                auth
                    // The login endpoint with Google is handled by Spring Security's filter
                    .requestMatchers("/oauth2/**", "/login/oauth2/**").permitAll()
                    // All other API endpoints require authentication
                    .requestMatchers("/api/**").authenticated()
                    // Any other request can be denied or permitted as needed
                    .anyRequest().permitAll()
            }
            .oauth2Login { oauth2 ->
                oauth2.successHandler(oAuth2AuthenticationSuccessHandler)
            }
            .addFilterBefore(jwtAuthenticationFilter, UsernamePasswordAuthenticationFilter::class.java)

        return http.build()
    }

    @Bean
    fun corsConfigurationSource(): CorsConfigurationSource {
        val configuration = CorsConfiguration()
        // Allow requests from the frontend development server and production URL
        configuration.allowedOrigins = listOf("http://localhost:4200", "http://clicker.patrickdd.com")
        configuration.allowedMethods = listOf("GET", "POST", "PUT", "DELETE", "OPTIONS")
        configuration.allowedHeaders = listOf("*")
        configuration.allowCredentials = true
        val source = UrlBasedCorsConfigurationSource()
        source.registerCorsConfiguration("/**", configuration)
        return source
    }
}