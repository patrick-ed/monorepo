package com.patrickdd.admin

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@EnableCaching
@SpringBootApplication
class AdminApplication
fun main(args: Array<String>) {
    runApplication<AdminApplication>(*args)
}
