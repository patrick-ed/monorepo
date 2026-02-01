package com.patrickdd.portfolio

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@EnableCaching
@SpringBootApplication
class PortfolioApplication

fun main(args: Array<String>) {
    runApplication<PortfolioApplication>(*args)
}
