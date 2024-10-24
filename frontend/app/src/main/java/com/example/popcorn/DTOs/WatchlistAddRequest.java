package com.example.popcorn.DTOs;

public class WatchlistAddRequest {
    private String userId;
    private int movieId;
    private String title;
    private String coverImage;

    // Constructor
    public WatchlistAddRequest(String userId, int movieId, String title, String coverImage) {
        this.userId = userId;
        this.movieId = movieId;
        this.title = title;
        this.coverImage = coverImage;
    }

    // Getters
    public String getUserId() {
        return userId;
    }

    public int getMovieId() {
        return movieId;
    }

    public String getTitle() {
        return title;
    }

    public String getCoverImage() {
        return coverImage;
    }

    // Setters
    public void setUserId(String userId) {
        this.userId = userId;
    }

    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setCoverImage(String coverImage) {
        this.coverImage = coverImage;
    }
}
