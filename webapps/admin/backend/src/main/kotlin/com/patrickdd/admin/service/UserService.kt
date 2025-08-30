package com.patrickdd.admin.service

import com.patrickdd.admin.model.User
import com.patrickdd.admin.repository.UserRepository
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Service

@Service
class UserService(
    private val userRepository: UserRepository,
    private val passwordEncoder: PasswordEncoder
) {

    fun createUser(user: User): User {
        if (userRepository.findByUsername(user.username) != null) {
            throw Exception("Username already exists")
        }
        val encodedPassword = passwordEncoder.encode(user.password)
        val newUser = user.copy(password = encodedPassword)
        return userRepository.save(newUser)
    }
}
