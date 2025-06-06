package com.patrickdd.clicker.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "users")
data class User(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: UUID = UUID.randomUUID(),

    @Column(nullable = false, unique = true)
    val googleId: String,

    @Column(nullable = false, unique = true)
    val email: String,

    @Column(nullable = false)
    val firstName: String,

    @Column(nullable = false)
    val lastName: String,

    @OneToOne(mappedBy = "user", cascade = [CascadeType.ALL], fetch = FetchType.LAZY)
    var clicks: Click? = null
)