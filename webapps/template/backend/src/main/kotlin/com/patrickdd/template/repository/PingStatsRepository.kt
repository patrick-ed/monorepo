package com.patrickdd.template.repository

import com.patrickdd.template.model.PingStats
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.stereotype.Repository

import java.time.Instant
@Repository
interface PingStatsRepository : JpaRepository<PingStats, Long> {

  @Modifying
  @Query("UPDATE PingStats p SET p.clicks = p.clicks + 1, p.lastPing = :lastPing WHERE p.identifier = :identifier")
  fun incrementClicksByIdentifier(identifier: String, lastPing: Instant)
}
