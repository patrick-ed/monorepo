package com.patrickdd.admin.model

import jakarta.persistence.*

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long = 0,

    @Column(unique = true, nullable = false)
    val username: String,

    @Column(unique = true, nullable = false)
    val email: String,

    @Column(nullable = false)
    val password: String,

    var mfaEnabled: Boolean = true,
    var mfaSecret: String? = null,

    var otp: String? = null,
    var otpExpiryDate: java.time.LocalDateTime? = null

)
