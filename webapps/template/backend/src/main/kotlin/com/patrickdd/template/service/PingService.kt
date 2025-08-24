package com.patrickdd.template.service

import com.patrickdd.template.repository.PingStatsRepository
import jakarta.transaction.Transactional
import org.springframework.stereotype.Service
import java.time.Instant

@Service
class PingService(private val pingStatsRepository: PingStatsRepository) {
  companion object {
    private const val TOTAL_PINGS = "total_pings"
  }

  @Transactional
  fun recordPing() {
    pingStatsRepository.incrementClicksByIdentifier(TOTAL_PINGS, Instant.now())
  }
}
