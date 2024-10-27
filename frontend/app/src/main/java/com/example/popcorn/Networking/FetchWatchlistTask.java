package com.example.popcorn.Networking;

import android.content.Context;
import android.widget.Toast;
import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Adapters.MoviesAdapter;
import com.example.popcorn.DTOs.WatchlistRemoveRequest;
import com.example.popcorn.DTOs.WatchlistRequest;
import com.example.popcorn.DTOs.WatchlistResponse;
import com.example.popcorn.Models.Movie;
import com.example.popcorn.Models.Person;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

import java.util.ArrayList;
import java.util.List;

public class FetchWatchlistTask {
    private RecyclerView recyclerView;
    private String userId;
    private Context context;

    public FetchWatchlistTask(RecyclerView recyclerView, String userId, Context context) {
        this.recyclerView = recyclerView;
        this.userId = userId;
        this.context = context;
    }

    public void fetchWatchlist() {
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        WatchlistRequest request = new WatchlistRequest(userId);
        Call<WatchlistResponse> call = apiService.fetchWatchlist(request);

        call.enqueue(new Callback<WatchlistResponse>() {
            @Override
            public void onResponse(Call<WatchlistResponse> call, Response<WatchlistResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Movie> movies = convertToMovieList(response.body().getWatchList());
                    if (movies.isEmpty()) {
                        Toast.makeText(context, "Watchlist is empty", Toast.LENGTH_LONG).show();
                    } else {
                        recyclerView.setAdapter(new MoviesAdapter(context, movies,true));
                    }
                } else {
                    Toast.makeText(context, "Failed to fetch watchlist", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<WatchlistResponse> call, Throwable t) {
                Toast.makeText(context, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private List<Movie> convertToMovieList(List<WatchlistResponse.Movie> watchListMovies) {
        List<Movie> movies = new ArrayList<>();
        for (WatchlistResponse.Movie watchMovie : watchListMovies) {
            Movie movie = new Movie(watchMovie.getMovieId(), watchMovie.getTitle(), "https://image.tmdb.org/t/p/w500" + watchMovie.getCoverImage(), "", new ArrayList<>(), new ArrayList<>());
            fetchCredits(movie);
            movies.add(movie);
        }
        return movies;
    }

    private void fetchCredits(Movie movie) {
        // Here, you will need to implement actual fetching of cast and crew from your backend or external API.
        // This is a placeholder for the network call to fetch cast and crew.
        // Assume you have a method similar to fetchMovies that also retrieves cast and crew for a given movie ID.
        // The implementation depends on your actual API specifications.
    }

    public void removeMovieFromWatchlist(String userId, int movieId, Runnable onSuccess) {
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<ResponseBody> call = apiService.removeFromWatchlist(new WatchlistRemoveRequest(userId, movieId));

        call.enqueue(new Callback<ResponseBody>() {
            @Override
            public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                if (response.isSuccessful()) {
                    Toast.makeText(context, "Movie removed from watchlist", Toast.LENGTH_SHORT).show();
                    onSuccess.run(); // Callback to handle UI update
                } else {
                    Toast.makeText(context, "Failed to remove movie", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<ResponseBody> call, Throwable t) {
                Toast.makeText(context, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

}
