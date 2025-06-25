package com.patrickdd.statify.dto

import java.time.Instant
/**
 * Represents status of app.
 *
 * @property status App status
 * @property environment Current environment defined in .env file (e.g., "dev", "prod").
 * @property currentTime Current time on the server in UTC.
 * @property uptime Duration of how long server has been up for.
 */
data class StatusDto(
    val status: String,
    val environment: String,
    val currentTime: Instant,
    val uptime: String
)