package com.patrickdd.clicker.entity

import jakarta.persistence.*
import java.util.UUID

@Entity
@Table(name = "clicks")
data class Click(
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    val id: UUID = UUID.randomUUID(),

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", referencedColumnName = "id")
    val user: User,

    @Column(nullable = false)
    var count: Long = 0
)