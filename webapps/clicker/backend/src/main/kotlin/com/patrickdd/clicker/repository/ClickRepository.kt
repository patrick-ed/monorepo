package com.patrickdd.clicker.repository

import com.patrickdd.clicker.entity.Click
import com.patrickdd.clicker.entity.User
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.stereotype.Repository
import java.util.*

@Repository
interface ClickRepository : JpaRepository<Click, UUID> {
    fun findByUser(user: User): Optional<Click>
}