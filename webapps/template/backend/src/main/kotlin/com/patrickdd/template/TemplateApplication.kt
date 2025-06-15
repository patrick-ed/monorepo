package com.patrickdd.template

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@EnableCaching
@SpringBootApplication
class TemplateApplication

fun main(args: Array<String>) {
    runApplication<TemplateApplication>(*args)
}
