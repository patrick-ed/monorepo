package com.patrickdd.template.model

import jakarta.persistence.*

@Entity
@Table(name = "ping_stats")
data class PingStats(
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) val id: Long,
    @Column(unique = true) val identifier: String,
    @Column(nullable = false) var clicks: Int
)
