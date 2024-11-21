package com.example.popcorn.Networking;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Adapters.MoviesAdapter;
import com.example.popcorn.DTOs.MoviesResponse;
import com.example.popcorn.Models.Movie;

import java.util.ArrayList;
import java.util.List;

import retrofit2.Call;
import retrofit2.Response;

public class FetchSimilarMoviesTask extends AsyncTask<Void, Void, List<Movie>> {
    private static final String TAG = "FetchSimilarMoviesTask";
    private RecyclerView recyclerView;
    private int movieId;

    public FetchSimilarMoviesTask(RecyclerView recyclerView, int movieId) {
        this.recyclerView = recyclerView;
        this.movieId = movieId;
    }

    @Override
    protected List<Movie> doInBackground(Void... voids) {
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<MoviesResponse> call = apiService.getSimilarMovies(movieId);

        try {
            Response<MoviesResponse> response = call.execute();
            if (response.isSuccessful() && response.body() != null) {
                logResponseBody(response.body());
                return response.body().getResults();
            } else {
                Log.e(TAG, "Error fetching similar movies: " + response.errorBody());
                return new ArrayList<>();
            }
        } catch (Exception e) {
            Log.e(TAG, "Exception while fetching similar movies", e);
            return new ArrayList<>();
        }
    }

    @Override
    protected void onPostExecute(List<Movie> movies) {
        if (movies != null && !movies.isEmpty()) {
            MoviesAdapter adapter = new MoviesAdapter(recyclerView.getContext(), movies, false, "none");
            recyclerView.setAdapter(adapter);
        } else {
            Toast.makeText(recyclerView.getContext(), "No similar movies found", Toast.LENGTH_LONG).show();
        }
    }

    private void logResponseBody(MoviesResponse responseBody) {
        try {
            Log.d(TAG, "Response Body: " + responseBody); // Using the responseBody's toString method for logging
        } catch (Exception e) {
            Log.e(TAG, "Failed to log response body", e);
        }
    }
}
