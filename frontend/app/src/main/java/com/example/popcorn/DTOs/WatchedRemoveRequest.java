package com.example.popcorn.DTOs;

public class WatchedRemoveRequest {
    private String userId;
    private int movieId;

    // Constructor
    public WatchedRemoveRequest(String userId, int movieId) {
        this.userId = userId;
        this.movieId = movieId;
    }

    // Getters and Setters
    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public int getMovieId() {
        return movieId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }
}
