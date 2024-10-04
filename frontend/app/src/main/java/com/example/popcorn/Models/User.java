package com.example.popcorn.Models;

public class User {
    String firstName;
    String lastName;
    String username;
    String email;
    String password;
    String confirmPassword;
    String gender;

    // Constructor updated to include firstName and lastName
    public User(String firstName, String lastName, String username, String email, String password, String confirmPassword, String gender) {
        this.firstName = firstName;
        this.lastName = lastName;
        this.username = username;
        this.email = email;
        this.password = password;
        this.confirmPassword = confirmPassword;
        this.gender = gender;
    }

    // Getters and Setters (if needed) can be added here to manage the properties
}
