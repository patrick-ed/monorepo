package com.patrickdd.admin.controller

import com.patrickdd.admin.dto.StatusDto
import com.patrickdd.admin.service.UptimeService
import com.patrickdd.admin.utils.TimeUtils.Companion.formatDuration
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant


@RestController
@RequestMapping("/api/v1/public/status")
class StatusController(
    @Value("\${app.metadata.environment:unknown}")
    private val environment: String,
    private val uptimeService: UptimeService
) {

    @GetMapping
    fun getApplicationStatus(): StatusDto {
        return StatusDto(
            status = "OK",
            environment = environment,
            currentTime = Instant.now(),
            uptime = formatDuration(uptimeService.getUptime())
        )
    }
}