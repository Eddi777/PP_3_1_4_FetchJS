package ru.kata.spring.boot_security.demo.controller;

import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import ru.kata.spring.boot_security.demo.model.User;
import ru.kata.spring.boot_security.demo.service.UserService;

import java.util.List;

@RestController
@RequestMapping("/api")
public class apiController {

    final UserService userService;
    public apiController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping()
    public String openAdminPage() {
        return "None";
    }

    @GetMapping("/mainUser")
    public User getMainUser(@AuthenticationPrincipal User user) {
        return user;
    }

    @GetMapping("/usersList")
    public List<User> getUsersList(@AuthenticationPrincipal User user) {
        if (user.isAdmin()) {
            return userService.findAll();
        }
        return List.of(user);
    }

    @PostMapping("/userAdd")
    public String userAdd(@RequestBody User user) {
        System.out.println("User was added -" + user);
        User userFromBD = userService.getUserByUsername(user.getUsername());
        if (userFromBD == null) {
            user.setActive(true);
            userService.saveUser(user);
            return "OK";
        }
        return "User was available";
    }

    @PostMapping("/userDelete")
    public void userDelete(@RequestBody User user) {
        System.out.println("Delete user -" + user);
        userService.deleteById(user.getId());
    }

    @PostMapping(value = "/userEdit")
    public void userEdit(@RequestBody User user) {
        System.out.println("Edit user -" + user);
        user.setActive(true);
        userService.updateUser(user);
    }
}
