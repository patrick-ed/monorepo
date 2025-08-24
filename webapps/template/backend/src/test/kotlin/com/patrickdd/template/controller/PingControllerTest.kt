package com.patrickdd.template.controller

import com.patrickdd.template.model.PingStats
import com.patrickdd.template.repository.PingStatsRepository
import com.patrickdd.template.service.PingService
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import java.time.Instant

@WebMvcTest(PingController::class)
class PingControllerTest {

    @TestConfiguration
    class ControllerTestConfig {
        @Bean
        fun pingService(): PingService = Mockito.mock(PingService::class.java)

        @Bean
        fun pingStatsRepository(): PingStatsRepository = Mockito.mock(PingStatsRepository::class.java)
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var pingService: PingService

    @Autowired
    private lateinit var pingStatsRepository: PingStatsRepository

    @Test
    fun pingShouldReturnPong() {
        mockMvc.perform(get("/api/v1/ping"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.response").value("Pong"))
    }

    @Test
    fun pingStatsShouldReturnPingStatistics() {
        val now = Instant.now()
        val pingStats = PingStats(identifier = "total_pings", clicks = 10, lastPing = now)
        whenever(pingStatsRepository.findAll()).thenReturn(listOf(pingStats))

        mockMvc.perform(get("/api/v1/ping/stats"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.identifier").value("total_pings"))
            .andExpect(jsonPath("$.clicks").value(10))
            .andExpect(jsonPath("$.lastPing").value(now.toString()))
    }
}
