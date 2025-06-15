package com.patrickdd.template.dto

import java.time.Instant

/**
 * Represents status of app.
 *
 * @property status App status
 * @property environment Current environment defined in .env file (e.g., "dev", "prod").
 * @property serverTime Current time on the server in UTC.
 */
data class StatusDto(
    val status: String,
    val environment: String,
    val serverTime: Instant,
)