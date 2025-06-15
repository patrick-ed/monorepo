package com.patrickdd.template.filter

import io.github.bucket4j.Bandwidth
import jakarta.servlet.http.HttpServletRequest
import org.springframework.stereotype.Component
import org.springframework.web.filter.OncePerRequestFilter
import java.util.concurrent.ConcurrentHashMap
import io.github.bucket4j.Bucket
import io.github.bucket4j.Refill
import jakarta.servlet.FilterChain
import jakarta.servlet.http.HttpServletResponse
import java.time.Duration


@Component
class RateLimitFilter : OncePerRequestFilter() {

    // In-memory buckets
    private val cache = ConcurrentHashMap<String, Bucket>()

    companion object {
        private const val CAPACITY = 100L // Maximum amount of tokens a bucket can hold
        private const val REFILL_AMOUNT_TOKENS = 50L // Amount of tokens added back
        private const val REFILL_INTERVAL_SECONDS = 60L // Interval to add tokens
    }

    override fun doFilterInternal(
        request: HttpServletRequest,
        response: HttpServletResponse,
        filterChain: FilterChain
    ) {
        val ip = request.remoteAddr
        val bucket = cache.computeIfAbsent(ip) { createNewBucket() }

        if (bucket.tryConsume(1)) {
            filterChain.doFilter(request, response)
        } else {
            response.status = 429
            response.writer.write("Too Many Requests")
        }
    }

    private fun createNewBucket(): Bucket {
        val limit = Bandwidth.classic(
            CAPACITY,
            Refill.intervally(
                REFILL_AMOUNT_TOKENS,
                Duration.ofSeconds(REFILL_INTERVAL_SECONDS)
            )
        )
        return Bucket.builder()
            .addLimit(limit)
            .build()
    }
}