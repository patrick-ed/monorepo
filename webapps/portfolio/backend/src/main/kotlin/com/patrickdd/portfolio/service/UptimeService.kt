package com.patrickdd.portfolio.service

import org.springframework.stereotype.Service
import kotlin.time.Duration
import kotlin.time.TimeSource

@Service
class UptimeService {
    private val serverStartTimeMark = TimeSource.Monotonic.markNow()

    fun getUptime(): Duration {
        return serverStartTimeMark.elapsedNow()
    }
}