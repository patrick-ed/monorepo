package com.patrickdd.admin.controller

import com.patrickdd.admin.model.User
import com.patrickdd.admin.repository.UserRepository
import com.patrickdd.admin.service.OtpService
import com.patrickdd.admin.service.UserService
import com.patrickdd.admin.utils.JwtUtil
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.security.authentication.AuthenticationManager
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/auth")
class AuthController(
    private val authenticationManager: AuthenticationManager,
    private val userService: UserService,
    private val otpService: OtpService,
    private val userRepository: UserRepository,
    private val jwtUtil: JwtUtil
) {

    @PostMapping("/login")
    fun login(@RequestBody loginRequest: LoginRequest): ResponseEntity<String> {
        authenticationManager.authenticate(
            UsernamePasswordAuthenticationToken(loginRequest.username, loginRequest.password)
        )

        val user = userRepository.findByUsername(loginRequest.username)
        if (user != null) {
            otpService.generateAndSendOtp(user)
            return ResponseEntity.ok("OTP sent to your email")
        }
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found")
    }

    @PostMapping("/verify-otp")
    fun verifyOtp(@RequestBody verifyOtpRequest: VerifyOtpRequest): ResponseEntity<Map<String, String>> {
        if (otpService.verifyOtp(verifyOtpRequest.username, verifyOtpRequest.otp)) {
            val user = userRepository.findByUsername(verifyOtpRequest.username)!!
            val token = jwtUtil.generateToken(user.username)
            return ResponseEntity.ok(mapOf("token" to token))
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(mapOf("error" to "Invalid or expired OTP"))
    }

    /** Block off any other random people registering (very hacky) */
//    @PostMapping("/register")
    fun register(@RequestBody registerRequest: RegisterRequest): ResponseEntity<String> {
        val user = User(
            username = registerRequest.username,
            email = registerRequest.email,
            password = registerRequest.password
        )
        userService.createUser(user)
        return ResponseEntity.ok("User registered successfully")
    }
}

data class LoginRequest(val username: String, val password: String)
data class RegisterRequest(val username: String, val email: String, val password: String)
data class VerifyOtpRequest(val username: String, val otp: String)
