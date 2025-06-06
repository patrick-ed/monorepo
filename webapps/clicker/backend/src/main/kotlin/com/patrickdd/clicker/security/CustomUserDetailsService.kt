package com.patrickdd.clicker.security

import com.patrickdd.clicker.repository.UserRepository
import org.springframework.security.core.userdetails.User
import org.springframework.security.core.userdetails.UserDetails
import org.springframework.security.core.userdetails.UserDetailsService
import org.springframework.security.core.userdetails.UsernameNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

@Service
class CustomUserDetailsService(private val userRepository: UserRepository) : UserDetailsService {

    @Transactional
    override fun loadUserByUsername(userId: String): UserDetails {
        val user = userRepository.findById(UUID.fromString(userId))
            .orElseThrow { throw UsernameNotFoundException("User not found with id: $userId") }

        return User(user.id.toString(), "", emptyList())
    }
}