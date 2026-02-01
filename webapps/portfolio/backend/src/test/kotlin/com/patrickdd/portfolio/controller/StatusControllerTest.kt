package com.patrickdd.portfolio.controller

import com.patrickdd.portfolio.service.UptimeService
import org.junit.jupiter.api.Test
import org.mockito.Mockito
import org.mockito.kotlin.whenever
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.boot.test.autoconfigure.web.servlet.WebMvcTest
import org.springframework.boot.test.context.TestConfiguration
import org.springframework.context.annotation.Bean
import org.springframework.test.context.TestPropertySource
import org.springframework.test.web.servlet.MockMvc
import org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath
import org.springframework.test.web.servlet.result.MockMvcResultMatchers.status
import kotlin.time.Duration.Companion.seconds

@WebMvcTest(StatusController::class)
@TestPropertySource(properties = ["app.metadata.environment=test"])
class StatusControllerTest {

    @TestConfiguration
    class ControllerTestConfig {
        @Bean
        fun uptimeService(): UptimeService = Mockito.mock(UptimeService::class.java)
    }

    @Autowired
    private lateinit var mockMvc: MockMvc

    @Autowired
    private lateinit var uptimeService: UptimeService

    @Test
    fun getApplicationStatusShouldReturnApplicationStatus() {
        val uptime = 12345.seconds
        whenever(uptimeService.getUptime()).thenReturn(uptime)

        mockMvc.perform(get("/api/v1/status"))
            .andExpect(status().isOk)
            .andExpect(jsonPath("$.status").value("OK"))
            .andExpect(jsonPath("$.environment").value("test"))
            .andExpect(jsonPath("$.uptime").value("0 days, 3 hours, 25 minutes, 45 seconds"))
    }
}
