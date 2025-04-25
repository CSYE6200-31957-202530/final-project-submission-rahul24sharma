/*
 * Click nbfs://nbhost/SystemFileSystem/Templates/Licenses/license-default.txt to change this license
 * Click nbfs://nbhost/SystemFileSystem/Templates/Classes/Class.java to edit this template
 */
package com.backend.Backend.repository;

import com.backend.Backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

/**
 *
 * @author rahul
 */
public interface UserRepository extends JpaRepository<User, Long> {
}
