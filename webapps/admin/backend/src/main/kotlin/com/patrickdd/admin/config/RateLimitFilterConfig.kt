package com.patrickdd.admin.config

import com.patrickdd.admin.filter.RateLimitFilter
import org.springframework.boot.web.servlet.FilterRegistrationBean
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class FilterConfig {

    @Bean
    fun rateLimitFilterRegistration(rateLimitFilter: RateLimitFilter): FilterRegistrationBean<RateLimitFilter> {
        val registration = FilterRegistrationBean(rateLimitFilter)
        registration.order = 1 // Order of execution
        return registration
    }
}