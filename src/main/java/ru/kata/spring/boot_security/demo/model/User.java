package ru.kata.spring.boot_security.demo.model;


import lombok.Data;
import lombok.ToString;
import org.hibernate.annotations.Cascade;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.*;
import java.util.Collection;
import java.util.HashSet;
import java.util.Set;

@Data
@Entity
@Table(name="users", schema="test")
public class User implements UserDetails {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;
    private String lastname;
    private byte age;
    private String username;
    private String password;
    private boolean active;

//    @ElementCollection (targetClass = Role.class, fetch = FetchType.EAGER)
//    @Enumerated(EnumType.STRING)
    @OneToMany (cascade = CascadeType.ALL)
    @JoinTable (
            name="role",
            joinColumns = @JoinColumn(name="user_id")
    )
    private Set<Role> roles = new HashSet<>();

    public void addRole(Role role) {
        roles.add(role);
    }

    public String getRolesAsString () {
        String res = "";
        for (Role role: roles) {
            res += (res.length() == 0) ? role.getRole(): ", " + role.getRole();
        }
        return res;
    }

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return getRoles();
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return isActive();
    }

    @Override
    public String toString() {
        return "User{" +
                "id=" + id +
                ", name='" + name + '\'' +
                ", lastname='" + lastname + '\'' +
                ", age=" + age +
                ", username='" + username + '\'' +
                ", password='" + password + '\'' +
                ", active=" + active +
                ", roles=" + roles +
                '}';
    }

    public boolean isAdmin() {
        return roles.contains("ADMIN");
    }
}
