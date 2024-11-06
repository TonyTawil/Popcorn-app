package com.example.popcorn.Networking;

import android.os.AsyncTask;
import android.util.Log;
import android.widget.Toast;
import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Models.Movie;
import com.example.popcorn.Models.Person;
import com.example.popcorn.Adapters.MoviesAdapter;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;

public class FetchMoviesTask extends AsyncTask<Void, Void, List<Movie>> {
    private static final String TAG = "FetchMoviesTask";
    private RecyclerView recyclerView;
    private int page;
    private int itemsPerPage;
    private String movieType;  // "trending" or "now_playing"

    public FetchMoviesTask(RecyclerView recyclerView, int page, int itemsPerPage, String movieType) {
        this.recyclerView = recyclerView;
        this.page = page;
        this.itemsPerPage = itemsPerPage;
        this.movieType = movieType;
    }

    @Override
    protected List<Movie> doInBackground(Void... voids) {
        HttpURLConnection urlConnection = null;
        BufferedReader reader = null;
        String moviesJsonStr = null;

        try {
            String baseUrl;
            if (movieType.equals("trending")) {
                baseUrl = "https://api.themoviedb.org/3/trending/movie/day";
            } else {
                baseUrl = "https://api.themoviedb.org/3/movie/" + movieType;
            }
            String apiKey = "dd3d9dbf9084e05fc04b0252cbe3da26";
            String fullUrl = baseUrl + "?api_key=" + apiKey + "&page=" + page;

            URL url = new URL(fullUrl);
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
            Log.e(TAG, "Error ", e);
            return null;
        } finally {
            if (urlConnection != null) {
                urlConnection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    Log.e(TAG, "Error closing stream", e);
                }
            }
        }
    }


    // Inside FetchMoviesTask, after fetching movies, fetch credits for each movie
    private List<Movie> parseMoviesFromJson(String moviesJsonStr) {
        List<Movie> results = new ArrayList<>();
        try {
            JSONObject moviesJson = new JSONObject(moviesJsonStr);
            JSONArray moviesArray = moviesJson.getJSONArray("results");

            for (int i = 0; i < Math.min(itemsPerPage, moviesArray.length()); i++) {
                JSONObject movieJson = moviesArray.getJSONObject(i);
                int movieId = movieJson.getInt("id");
                String title = movieJson.getString("title");
                String posterPath = "https://image.tmdb.org/t/p/w500" + movieJson.getString("poster_path");
                String plot = movieJson.optString("overview", "No description available.");

                List<Person> cast = fetchCredits(movieId, "cast");
                List<Person> crew = fetchCredits(movieId, "crew");

                results.add(new Movie(movieId, title, posterPath, plot, cast, crew));
            }
        } catch (Exception e) {
            Log.e(TAG, "Error parsing JSON", e);
        }

        return results;
    }

    private List<Person> fetchCredits(int movieId, String type) {
        List<Person> people = new ArrayList<>();
        HttpURLConnection connection = null;
        BufferedReader reader = null;
        try {
            URL url = new URL("https://api.themoviedb.org/3/movie/" + movieId + "/credits?api_key=dd3d9dbf9084e05fc04b0252cbe3da26");
            connection = (HttpURLConnection) url.openConnection();
            connection.setRequestMethod("GET");
            connection.connect();

            InputStream inputStream = connection.getInputStream();
            StringBuilder buffer = new StringBuilder();
            if (inputStream == null) {
                return people;
            }
            reader = new BufferedReader(new InputStreamReader(inputStream));

            String line;
            while ((line = reader.readLine()) != null) {
                buffer.append(line).append("\n");
            }

            String jsonStr = buffer.toString();
            JSONObject json = new JSONObject(jsonStr);
            JSONArray peopleArray = json.getJSONArray(type);

            for (int i = 0; i < peopleArray.length(); i++) {
                JSONObject person = peopleArray.getJSONObject(i);
                String name = person.getString("name");
                String role = type.equals("cast") ? person.getString("character") : person.getString("job");
                String imageUrl = person.optString("profile_path");
                if (imageUrl != null && !imageUrl.isEmpty()) {
                    imageUrl = "https://image.tmdb.org/t/p/w500" + imageUrl;
                }
                people.add(new Person(name, role, imageUrl));
            }
        } catch (IOException | JSONException e) {
            Log.e(TAG, "Error fetching credits", e);
            return null; // Ensure null is returned if there's an error
        } finally {
            if (connection != null) {
                connection.disconnect();
            }
            if (reader != null) {
                try {
                    reader.close();
                } catch (IOException e) {
                    Log.e(TAG, "Error closing stream", e);
                }
            }
        }
        return people;
    }





    @Override
    protected void onPostExecute(List<Movie> movies) {
        if (movies != null) {
            // Passing context from the RecyclerView to the adapter
            recyclerView.setAdapter(new MoviesAdapter(recyclerView.getContext(), movies, false,"none"));
        } else {
            Toast.makeText(recyclerView.getContext(), "Failed to fetch movies data", Toast.LENGTH_LONG).show();
        }
    }

}