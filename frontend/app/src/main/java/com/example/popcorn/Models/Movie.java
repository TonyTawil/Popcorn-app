package com.example.popcorn.Models;

import java.util.List;

public class Movie {
    private int movieId;
    private String title;
    private String posterPath;
    private String plot;
    private List<Person> cast;
    private List<Person> crew;

    // Modified constructor
    public Movie(int movieId, String title, String posterPath, String plot, List<Person> cast, List<Person> crew) {
        this.movieId = movieId;
        this.title = title;
        this.posterPath = posterPath;
        this.plot = plot;
        this.cast = cast;
        this.crew = crew;
    }

    // Default constructor
    public Movie() {}

    // Setters
    public void setMovieId(int movieId) {
        this.movieId = movieId;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setPosterPath(String posterPath) {
        this.posterPath = posterPath;
    }

    public void setPlot(String plot) {
        this.plot = plot;
    }

    public void setCast(List<Person> cast) {
        this.cast = cast;
    }

    public void setCrew(List<Person> crew) {
        this.crew = crew;
    }

    // Getters
    public int getMovieId() {
        return movieId;
    }

    public String getTitle() {
        return title;
    }

    public String getPosterPath() {
        return posterPath;
    }

    public String getPlot() {
        return plot;
    }

    public List<Person> getCast() {
        return cast;
    }

    public List<Person> getCrew() {
        return crew;
    }
}
