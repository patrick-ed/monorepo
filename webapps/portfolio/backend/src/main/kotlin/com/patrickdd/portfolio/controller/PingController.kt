package com.patrickdd.portfolio.controller

import com.patrickdd.portfolio.model.PingStats
import com.patrickdd.portfolio.repository.PingStatsRepository
import com.patrickdd.portfolio.service.PingService
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
