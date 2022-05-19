package ru.kata.spring.boot_security.demo.service;

import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.repository.UserRepositoryImpl;

import java.util.List;

public interface UserService extends UserDetailsService {

    User getUserByUsername(String username);
    void saveUser(User user);
    void updateUser(User user);
    User findById(Long id);
    List<User> findAll();
    void deleteById(Long id);
    @Override
    UserDetails loadUserByUsername(String username) throws UsernameNotFoundException;
}
