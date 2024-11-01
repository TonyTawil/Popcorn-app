package com.example.popcorn.Networking;

import com.example.popcorn.DTOs.CreditsResponse;
import com.example.popcorn.DTOs.LoginUser;
import com.example.popcorn.DTOs.MoviesResponse;
import com.example.popcorn.DTOs.UserResponse;
import com.example.popcorn.DTOs.VerificationResponse;
import com.example.popcorn.DTOs.WatchlistAddRequest;
import com.example.popcorn.DTOs.WatchlistAddResponse;
import com.example.popcorn.DTOs.WatchlistRemoveRequest;
import com.example.popcorn.DTOs.WatchlistRequest;
import com.example.popcorn.DTOs.WatchlistResponse;
import com.example.popcorn.DTOs.WatchedAddRequest;
import com.example.popcorn.DTOs.WatchedAddResponse;
import com.example.popcorn.DTOs.WatchedRemoveRequest;
import com.example.popcorn.DTOs.WatchedRequest;
import com.example.popcorn.DTOs.WatchedResponse;
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
    // Authentication related endpoints
    @POST("api/auth/signup")
    Call<UserResponse> createUser(@Body User user);

    @POST("api/auth/login")
    Call<UserResponse> loginUser(@Body LoginUser loginUser);

    @GET("api/auth/is-verified/{userId}")
    Call<VerificationResponse> checkEmailVerified(@Path("userId") String userId);

    // Watchlist related endpoints
    @POST("api/movies/get-watchlist")
    Call<WatchlistResponse> fetchWatchlist(@Body WatchlistRequest request);

    @POST("api/movies/add-to-watchlist")
    Call<WatchlistAddResponse> addToWatchlist(@Body WatchlistAddRequest request);

    @POST("api/movies/remove-from-watchlist")
    Call<ResponseBody> removeFromWatchlist(@Body WatchlistRemoveRequest request);

    // Watched list related endpoints
    @POST("api/movies/get-watched")
    Call<WatchedResponse> fetchWatched(@Body WatchedRequest request);

    @POST("api/movies/add-to-watched")
    Call<WatchedAddResponse> addToWatched(@Body WatchedAddRequest request);

    @POST("api/movies/remove-from-watched")
    Call<ResponseBody> removeFromWatched(@Body WatchedRemoveRequest request);

    // TMDB API endpoints
    @GET("api/tmdb/movie/trending")
    Call<MoviesResponse> getTrendingMovies(@Query("page") int page);

    @GET("api/tmdb/movie/now_playing")
    Call<MoviesResponse> getNowPlayingMovies(@Query("page") int page);

    @GET("api/tmdb/movie/upcoming")
    Call<MoviesResponse> getUpcomingMovies(@Query("page") int page);

    @GET("api/tmdb/credits/{movieId}")
    Call<CreditsResponse> fetchCredits(@Path("movieId") int movieId);

    @GET("api/tmdb/similar/{movieId}")
    Call<List<Movie>> getSimilarMovies(@Path("movieId") int movieId);
}
