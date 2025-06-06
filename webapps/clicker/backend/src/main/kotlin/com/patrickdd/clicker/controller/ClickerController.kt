package com.patrickdd.clicker.controller

import com.patrickdd.clicker.dto.ClickDto
import com.patrickdd.clicker.service.ClickerService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/clicks")
class ClickerController(private val clickerService: ClickerService) {

    private fun getUserId(userDetails: UserDetails) = UUID.fromString(userDetails.username)

    @GetMapping
    fun getClicks(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<ClickDto> {
        val clicks = clickerService.getClicks(getUserId(userDetails))
        return ResponseEntity.ok(clicks)
    }

    @PostMapping("/increment")
    fun incrementClicks(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<ClickDto> {
        val newClicks = clickerService.incrementClicks(getUserId(userDetails))
        return ResponseEntity.ok(newClicks)
    }

    @PostMapping("/reset")
    fun resetClicks(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<ClickDto> {
        val resetClicks = clickerService.resetClicks(getUserId(userDetails))
        return ResponseEntity.ok(resetClicks)
    }
}