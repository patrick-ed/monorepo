package com.patrickdd.clicker.controller

import com.patrickdd.clicker.dto.UserDto
import com.patrickdd.clicker.service.ClickerService
import org.springframework.http.ResponseEntity
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

@RestController
@RequestMapping("/api/user")
class UserController(private val clickerService: ClickerService) {

    @GetMapping("/me")
    fun getCurrentUser(@AuthenticationPrincipal userDetails: UserDetails): ResponseEntity<UserDto> {
        val userId = UUID.fromString(userDetails.username)
        val userInfo = clickerService.getUserInfo(userId)
        return ResponseEntity.ok(userInfo)
    }
}