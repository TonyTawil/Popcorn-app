package com.example.popcorn.DTOs;

import com.example.popcorn.Models.Movie;
import java.util.List;

public class WatchedAddResponse {
    private String message;
    private List<Movie> watchedList;

    // Constructor
    public WatchedAddResponse(String message, List<Movie> watchedList) {
        this.message = message;
        this.watchedList = watchedList;
    }

    // Getters
    public String getMessage() {
        return message;
    }

    public List<Movie> getWatchedList() {
        return watchedList;
    }

    // Setters
    public void setMessage(String message) {
        this.message = message;
    }

    public void setWatchedList(List<Movie> watchedList) {
        this.watchedList = watchedList;
    }
}
