package com.example.popcorn.DTOs;

import com.example.popcorn.Models.Person;
import java.util.List;

public class CreditsResponse {
    private List<Person> cast;
    private List<Person> crew;

    // Getters and Setters
    public List<Person> getCast() {
        return cast;
    }

    public void setCast(List<Person> cast) {
        this.cast = cast;
    }

    public List<Person> getCrew() {
        return crew;
    }

    public void setCrew(List<Person> crew) {
        this.crew = crew;
    }
}
