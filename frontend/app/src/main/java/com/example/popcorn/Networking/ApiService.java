package com.example.popcorn.Networking;

import com.example.popcorn.DTOs.CreditsResponse;
import com.example.popcorn.DTOs.LoginUser;
import com.example.popcorn.DTOs.MoviesResponse;
import com.example.popcorn.DTOs.UserResponse;
import com.example.popcorn.DTOs.VerificationResponse;
import com.example.popcorn.DTOs.WatchlistRemoveRequest;
import com.example.popcorn.DTOs.WatchlistRequest;
import com.example.popcorn.DTOs.WatchlistResponse;
import com.example.popcorn.DTOs.WatchlistAddRequest;
import com.example.popcorn.DTOs.WatchlistAddResponse;
import com.example.popcorn.Models.Movie;
import com.example.popcorn.Models.User;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.GET;
import retrofit2.http.POST;
import retrofit2.http.Path;
import retrofit2.http.Query;

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

    // Ensure these match your Express backend routes exactly
    @GET("api/tmdb/movie/trending")
    Call<MoviesResponse> getTrendingMovies(@Query("page") int page);

    @GET("api/tmdb/movie/{type}")
    Call<MoviesResponse> getMoviesByType(@Path("type") String type, @Query("page") int page);

    @GET("api/tmdb/credits/{movieId}")
    Call<CreditsResponse> fetchCredits(@Path("movieId") int movieId);

    @GET("api/tmdb/similar/{movieId}")
    Call<List<Movie>> getSimilarMovies(@Path("movieId") int movieId);

    @POST("api/movies/remove-from-watchlist")
    Call<ResponseBody> removeFromWatchlist(@Body WatchlistRemoveRequest request);
}
