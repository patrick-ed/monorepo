package com.patrickdd.admin.service

import com.patrickdd.admin.model.User
import com.patrickdd.admin.repository.UserRepository
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import kotlin.random.Random

@Service
class OtpService(
    private val userRepository: UserRepository,
    private val emailService: EmailService
) {
    fun generateAndSendOtp(user: User) {
        val otp = Random.nextInt(100000, 999999).toString()
        val expiryDate = LocalDateTime.now().plusMinutes(10) // OTP is valid for 10 minutes

        user.otp = otp
        user.otpExpiryDate = expiryDate
        userRepository.save(user)

        emailService.sendOtpEmail(user.email, otp)
    }

    fun verifyOtp(username: String, otp: String): Boolean {
        val user = userRepository.findByUsername(username) ?: return false
        
        if (user.otp != otp || user.otpExpiryDate?.isBefore(LocalDateTime.now()) == true) {
            return false
        }

        // Clear OTP after successful verification
        user.otp = null
        user.otpExpiryDate = null
        userRepository.save(user)

        return true
    }
}
