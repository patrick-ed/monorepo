package com.patrickdd.admin.model

import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "ping_stats")
data class PingStats(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long = 0,
    @Column(unique = true) val identifier: String,
    @Column(nullable = false) var clicks: Int,
    @Column(nullable = false) var lastPing: Instant? = null
)
