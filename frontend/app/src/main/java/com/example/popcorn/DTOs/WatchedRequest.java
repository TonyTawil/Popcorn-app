package com.example.popcorn.DTOs;

public class WatchedRequest {
    private String userId;

    // Constructor
    public WatchedRequest(String userId) {
        this.userId = userId;
    }

    // Getter
    public String getUserId() {
        return userId;
    }

    // Setter
    public void setUserId(String userId) {
        this.userId = userId;
    }
}
