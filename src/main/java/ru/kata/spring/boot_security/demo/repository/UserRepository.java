package ru.kata.spring.boot_security.demo.repository;

import ru.kata.spring.boot_security.demo.model.User;

import java.util.List;

public interface UserRepository {

    List<User> getUsersList();
    void deleteById(long id);
    void saveUser(User user);
    void updateUser(User user);
    User getUserById(long id);
    User getUserByUsername(String username);

}
