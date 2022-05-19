package ru.kata.spring.boot_security.demo.model;

import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;

import javax.persistence.*;

@Entity
@Table(name = "roles", schema = "test")
@ToString
public class Role implements GrantedAuthority{
    ;
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;
    private String role;
    private long user_id;

    public Role(String role) {
        this.role = role;
    }

    public Role() {
    }

    public void setUser_id(long user_id) {
        this.user_id = user_id;
    }

    @Override
    public String getAuthority() {
        return getRole();
    }

    public long getId() {
        return id;
    }

    public void setId(long id) {
        this.id = id;
    }

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }
}
