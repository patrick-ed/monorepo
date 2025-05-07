package com.patrickdd.fullstackproject.model

import jakarta.persistence.Entity
import jakarta.persistence.Id
import jakarta.persistence.Table


@Entity
@Table(name = "users")
data class User(
    @Id
    val email: String,
    val firstname: String,
    val lastname: String
)