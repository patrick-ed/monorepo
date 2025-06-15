package com.patrickdd.template.controller

import com.patrickdd.template.dto.StatusDto
import com.patrickdd.template.service.UptimeService
import com.patrickdd.template.utils.TimeUtils.Companion.formatDuration
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant


@RestController
@RequestMapping("/api/v1/status")
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