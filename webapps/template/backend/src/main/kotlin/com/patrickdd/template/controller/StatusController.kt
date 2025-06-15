package com.patrickdd.template.controller

import com.patrickdd.template.dto.StatusDto
import org.springframework.beans.factory.annotation.Value
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.time.Instant


@RestController
@RequestMapping("/api/v1/status")
class StatusController(
    @Value("\${app.metadata.environment:unknown}") private val environment: String,
) {

    @GetMapping()
    fun getApplicationStatus(): StatusDto{
        return StatusDto(
            status = "OK",
            environment = environment,
            serverTime = Instant.now(),
        )
    }
}