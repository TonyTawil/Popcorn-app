package com.example.popcorn.Networking;

import com.example.popcorn.DTOs.CreditsResponse;
import com.example.popcorn.Models.User;
import com.example.popcorn.DTOs.LoginUser;
import com.example.popcorn.DTOs.UserResponse;
import com.example.popcorn.DTOs.VerificationResponse;
import com.example.popcorn.DTOs.WatchlistRequest;
import com.example.popcorn.DTOs.WatchlistResponse;
import com.example.popcorn.DTOs.WatchlistAddRequest;
import com.example.popcorn.DTOs.WatchlistAddResponse;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;

public interface ApiService {
    @POST("api/auth/signup")
    Call<UserResponse> createUser(@Body User user);

    @POST("api/auth/login")
    Call<UserResponse> loginUser(@Body LoginUser user);

    @GET("api/auth/is-verified/{userId}")
    Call<VerificationResponse> checkEmailVerified(@Path("userId") String userId);

    @POST("api/movies/get-watchlist")
    Call<WatchlistResponse> fetchWatchlist(@Body WatchlistRequest request);

    @POST("api/movies/add-to-watchlist")
    Call<WatchlistAddResponse> addToWatchlist(@Body WatchlistAddRequest request);

    @GET("api/tmdb/credits/{movieId}")
    Call<CreditsResponse> fetchCredits(@Path("movieId") int movieId);
}
