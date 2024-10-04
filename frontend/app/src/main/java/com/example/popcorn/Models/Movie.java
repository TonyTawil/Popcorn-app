package com.example.popcorn.Models;

import java.util.List;

public class Movie {
    private String title;
    private String posterPath;
    private String plot;
    private List<Person> cast;
    private List<Person> crew;

    public Movie(String title, String posterPath, String plot, List<Person> cast, List<Person> crew) {
        this.title = title;
        this.posterPath = posterPath;
        this.plot = plot;
        this.cast = cast;
        this.crew = crew;
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
