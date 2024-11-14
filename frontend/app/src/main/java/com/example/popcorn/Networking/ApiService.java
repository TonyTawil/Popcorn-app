package com.example.popcorn.Networking;

import com.example.popcorn.DTOs.CreditsResponse;
import com.example.popcorn.DTOs.LoginUser;
import com.example.popcorn.DTOs.MoviesResponse;
import com.example.popcorn.DTOs.ReviewRequest;
import com.example.popcorn.DTOs.ReviewResponse;
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
import com.example.popcorn.Models.Review;
import com.example.popcorn.Models.User;
import com.google.gson.JsonObject;

import java.util.List;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.DELETE;
import retrofit2.http.GET;
import retrofit2.http.HTTP;
import retrofit2.http.POST;
import retrofit2.http.PUT;
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

    @POST("api/reviews/add-review")
    Call<ReviewResponse> addReview(@Body ReviewRequest reviewRequest);

    @GET("api/reviews/{movieId}")
    Call<List<Review>> getReviewsByMovieId(@Path("movieId") int movieId);

    @HTTP(method = "DELETE", path = "api/reviews/{reviewId}", hasBody = true)
    Call<ResponseBody> deleteReview(@Path("reviewId") String reviewId, @Body JsonObject userId);

    @PUT("api/reviews/{reviewId}")
    Call<ReviewResponse> updateReview(@Path("reviewId") String reviewId, @Body ReviewRequest reviewRequest);

    @GET("api/tmdb/similar/{movieId}")
    Call<MoviesResponse> getSimilarMovies(@Path("movieId") int movieId);

}
