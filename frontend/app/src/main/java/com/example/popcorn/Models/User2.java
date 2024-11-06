package com.example.popcorn.Models;

public class User2 {
    private String _id;
    private String username;

    // Constructor
    public User2(String _id, String username) {
        this._id = _id;
        this.username = username;
    }

    // Getters and setters
    public String getId() {
        return _id;
    }

    public void setId(String _id) {
        this._id = _id;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }
}
