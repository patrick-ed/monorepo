package com.patrickdd.admin.service

import org.springframework.beans.factory.annotation.Value
import org.springframework.mail.SimpleMailMessage
import org.springframework.mail.javamail.JavaMailSender
import org.springframework.stereotype.Service

@Service
class EmailService(private val mailSender: JavaMailSender) {

    @Value("\${EMAIL_USERNAME}")
    private lateinit var fromEmail: String

    fun sendOtpEmail(to: String, otp: String) {
        val message = SimpleMailMessage()
        message.from = fromEmail
        message.setTo(to)
        message.subject = "admin"
        message.text = "otp: $otp"
        mailSender.send(message)
    }
}