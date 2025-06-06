package com.patrickdd.clicker

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication

@SpringBootApplication
class ClickerApplication

fun main(args: Array<String>) {
	runApplication<ClickerApplication>(*args)
	println("Start up complete")
}
