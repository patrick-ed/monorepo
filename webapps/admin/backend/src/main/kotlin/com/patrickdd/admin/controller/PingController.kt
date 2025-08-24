package com.patrickdd.admin.controller

import com.patrickdd.admin.model.PingStats
import com.patrickdd.admin.repository.PingStatsRepository
import com.patrickdd.admin.service.PingService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/ping")
class PingController(
    private val pingStatsRepository: PingStatsRepository,
    private val pingService: PingService
) {

  @GetMapping
  fun ping(): PingResponse {
    pingService.recordPing()
    return PingResponse("Pong")
  }

  @GetMapping("/stats")
  fun pingStats(): PingStats {
    val pingStat = pingStatsRepository.findAll()[0]
    return pingStat
  }

  data class PingResponse(val response: String)
}
