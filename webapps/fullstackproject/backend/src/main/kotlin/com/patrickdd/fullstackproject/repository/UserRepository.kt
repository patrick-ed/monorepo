package com.patrickdd.fullstackproject.repository

import com.patrickdd.fullstackproject.model.User
import org.springframework.data.jpa.repository.JpaRepository


interface UserRepository : JpaRepository<User, String>