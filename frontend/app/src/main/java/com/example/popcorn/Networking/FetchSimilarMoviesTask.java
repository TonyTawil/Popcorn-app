package com.example.popcorn.Networking;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;

import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Adapters.MoviesAdapter;
import com.example.popcorn.Models.Movie;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.ProtocolException;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class FetchSimilarMoviesTask extends AsyncTask<Void, Void, List<Movie>> {
    private static final String API_KEY = "dd3d9dbf9084e05fc04b0252cbe3da26";
    private RecyclerView recyclerView;
    private int movieId;

    public FetchSimilarMoviesTask(RecyclerView recyclerView, int movieId) {
        this.recyclerView = recyclerView;
        this.movieId = movieId;
    }

    @Override
    protected List<Movie> doInBackground(Void... voids) {
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;
        String moviesJsonStr = null;

        try {
            URL url = new URL("https://api.themoviedb.org/3/movie/" + movieId + "/recommendations?api_key=" + API_KEY + "&page=1");
            urlConnection = (HttpURLConnection) url.openConnection();
            urlConnection.setRequestMethod("GET");
            urlConnection.connect();

            InputStream inputStream = urlConnection.getInputStream();
            StringBuilder buffer = new StringBuilder();
            if (inputStream == null) {
                return null;
            }
            reader = new BufferedReader(new InputStreamReader(inputStream));

            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line).append("\n");
            }

            moviesJsonStr = buffer.toString();
            return parseMoviesFromJson(moviesJsonStr);
        } catch (IOException e) {
            Log.e("FetchSimilarMoviesTask", "Error ", e);
            return null;
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    Log.e("FetchSimilarMoviesTask", "Error closing stream", e);
                }
            }
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


    private List<Movie> parseMoviesFromJson(String moviesJsonStr) {
        if (moviesJsonStr == null || moviesJsonStr.isEmpty()) {
            return null;
        }

        List<Movie> moviesList = new ArrayList<>();

        try {
            JSONObject jsonObject = new JSONObject(moviesJsonStr);
            JSONArray resultsArray = jsonObject.getJSONArray("results");

            for (int i = 0; i < 7; i++) {
                JSONObject movieJson = resultsArray.getJSONObject(i);
                int id = movieJson.getInt("id");
                String title = movieJson.getString("title");
                String posterPath = movieJson.optString("poster_path", "");
                String plot = movieJson.optString("overview", "No description available.");

                // Handle full poster path
                if (!posterPath.isEmpty()) {
                    posterPath = "https://image.tmdb.org/t/p/w500" + posterPath;
                }

                Movie movie = new Movie(id, title, posterPath, plot, new ArrayList<>(), new ArrayList<>());
                moviesList.add(movie);
            }
        } catch (JSONException e) {
            Log.e("FetchSimilarMoviesTask", "Error parsing JSON", e);
            return null;
        }

        return moviesList;
    }

}
