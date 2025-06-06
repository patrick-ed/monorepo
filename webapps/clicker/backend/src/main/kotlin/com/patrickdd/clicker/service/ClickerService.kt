package com.patrickdd.clicker.service

import com.patrickdd.clicker.dto.ClickDto
import com.patrickdd.clicker.dto.UserDto
import com.patrickdd.clicker.entity.User
import com.patrickdd.clicker.repository.ClickRepository
import com.patrickdd.clicker.repository.UserRepository
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class ClickerService(
    private val userRepository: UserRepository,
    private val clickRepository: ClickRepository
) {

    private fun getUserById(userId: UUID): User {
        return userRepository.findById(userId)
            .orElseThrow { throw UsernameNotFoundException("User not found with id: $userId") }
    }

    fun getUserInfo(userId: UUID): UserDto {
        val user = getUserById(userId)
        return UserDto(user.email, user.firstName, user.lastName)
    }

    fun getClicks(userId: UUID): ClickDto {
        val user = getUserById(userId)
        val clicks = user.clicks ?: throw IllegalStateException("User has no clicks record.")
        return ClickDto(clicks.count)
    }

    @Transactional
    fun incrementClicks(userId: UUID): ClickDto {
        val user = getUserById(userId)
        val clicks = user.clicks ?: throw IllegalStateException("User has no clicks record.")
        clicks.count++
        val savedClicks = clickRepository.save(clicks)
        return ClickDto(savedClicks.count)
    }

    @Transactional
    fun resetClicks(userId: UUID): ClickDto {
        val user = getUserById(userId)
        val clicks = user.clicks ?: throw IllegalStateException("User has no clicks record.")
        clicks.count = 0
        val savedClicks = clickRepository.save(clicks)
        return ClickDto(savedClicks.count)
    }
}