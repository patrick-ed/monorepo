package com.patrickdd.portfolio.config

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebConfig {

    @Bean
    fun corsConfiguration(): WebMvcConfigurer{
        return object : WebMvcConfigurer{
            override fun addCorsMappings(registry: CorsRegistry) {
                registry.addMapping("/api/v1/**")
                    .allowedOrigins(
                        "https://*.patrickdd.com",
                        "https://patrickdd.com",
                        "http://localhost:4200"
                    )
                    .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            }
        }
    }
}