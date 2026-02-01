package com.patrickdd.portfolio.service

import com.patrickdd.portfolio.repository.PingStatsRepository
import org.junit.jupiter.api.Test
import org.junit.jupiter.api.extension.ExtendWith
import org.mockito.InjectMocks
import org.mockito.Mock
import org.mockito.junit.jupiter.MockitoExtension
import org.mockito.kotlin.any
import org.mockito.kotlin.eq
import org.mockito.kotlin.verify

@ExtendWith(MockitoExtension::class)
class PingServiceTest {

    @Mock
    private lateinit var pingStatsRepository: PingStatsRepository

    @InjectMocks
    private lateinit var pingService: PingService

    @Test
    fun recordPingShouldIncrementClicksAndSetTimestamp() {
        pingService.recordPing()
        verify(pingStatsRepository).incrementClicksByIdentifier(eq("total_pings"), any())
    }
}
