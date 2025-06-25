package com.patrickdd.statify

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@EnableCaching
@SpringBootApplication
class StatifyApplication

fun main(args: Array<String>) {
    runApplication<StatifyApplication>(*args)
}
