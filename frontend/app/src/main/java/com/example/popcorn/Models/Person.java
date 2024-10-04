package com.example.popcorn.Models;

import android.os.Parcel;
import android.os.Parcelable;

public class Person implements Parcelable {
    private String name;
    private String role;
    private String imageUrl; // URL for the image

    public Person(String name, String role, String imageUrl) {
        this.name = name;
        this.role = role;
        this.imageUrl = imageUrl;
    }

    protected Person(Parcel in) {
        name = in.readString();
        role = in.readString();
        imageUrl = in.readString();
    }

    @Override
    public void writeToParcel(Parcel dest, int flags) {
        dest.writeString(name);
        dest.writeString(role);
        dest.writeString(imageUrl);
    }

    @Override
    public int describeContents() {
        return 0;
    }

    public static final Creator<Person> CREATOR = new Creator<Person>() {
        @Override
        public Person createFromParcel(Parcel in) {
            return new Person(in);
        }

        @Override
        public Person[] newArray(int size) {
            return new Person[size];
        }
    };

    public String getName() {
        return name;
    }

    public String getRole() {
        return role;
    }

    public String getImageUrl() {
        return imageUrl;
    }
}
