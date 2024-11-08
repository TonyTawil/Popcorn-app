package com.example.popcorn.Activities;

import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.popcorn.Adapters.PeopleAdapter;
import com.example.popcorn.DTOs.WatchedAddRequest;
import com.example.popcorn.DTOs.WatchedAddResponse;
import com.example.popcorn.DTOs.WatchlistAddRequest;
import com.example.popcorn.DTOs.WatchlistAddResponse;
import com.example.popcorn.Models.Person;
import com.example.popcorn.Networking.ApiService;
import com.example.popcorn.Networking.RetrofitClient;
import com.example.popcorn.R;
import com.example.popcorn.Utils.NavigationManager;
import com.google.android.material.navigation.NavigationView;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class MovieDetailsActivity extends AppCompatActivity {
    private RecyclerView castRecyclerView, crewRecyclerView;
    private DrawerLayout drawerLayout;
    private NavigationManager navigationManager;
    private Button addToWatchlistButton, markAsWatchedButton, addReviewButton, viewReviewsButton;
    private SharedPreferences sharedPreferences;
    private int movieId;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_details);

        sharedPreferences = getSharedPreferences("MyPrefs", MODE_PRIVATE);
        movieId = getIntent().getIntExtra("movieId", -1);
        if (movieId == -1) {
            Toast.makeText(this, "Invalid movie details", Toast.LENGTH_LONG).show();
            finish();
            return;
        }

        Toolbar toolbar = findViewById(R.id.appBarLayout);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationManager = new NavigationManager(this, navigationView, drawerLayout);
        navigationManager.updateDrawerContents();
        setupDrawer(toolbar);

        ImageView moviePosterImageView = findViewById(R.id.moviePosterImageView);
        TextView movieTitleTextView = findViewById(R.id.movieTitleTextView);
        TextView moviePlotTextView = findViewById(R.id.moviePlotTextView);
        castRecyclerView = findViewById(R.id.castRecyclerView);
        crewRecyclerView = findViewById(R.id.crewRecyclerView);

        displayMovieDetails(moviePosterImageView, movieTitleTextView, moviePlotTextView);
        initRecyclerViews();

        addToWatchlistButton = findViewById(R.id.addToWatchlistButton);
        markAsWatchedButton = findViewById(R.id.markAsWatchedButton);
        addReviewButton = findViewById(R.id.addReviewButton);
        viewReviewsButton = findViewById(R.id.viewAllReviewsButton);

        addToWatchlistButton.setOnClickListener(v -> addToWatchlist());
        markAsWatchedButton.setOnClickListener(v -> addToWatched());
        addReviewButton.setOnClickListener(v -> openAddReviewActivity());
        viewReviewsButton.setOnClickListener(v -> openReviewsActivity());

        setupNavigationMenu(navigationView);
    }

    private void setupDrawer(Toolbar toolbar) {
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        toggle.getDrawerArrowDrawable().setColor(getResources().getColor(android.R.color.white));
    }

    private void displayMovieDetails(ImageView moviePosterImageView, TextView movieTitleTextView, TextView moviePlotTextView) {
        Intent intent = getIntent();
        String title = intent.getStringExtra("title");
        String posterPath = intent.getStringExtra("posterPath");
        String plot = intent.getStringExtra("plot");

        movieTitleTextView.setText(title);
        moviePlotTextView.setText(plot);
        Glide.with(this).load(posterPath).into(moviePosterImageView);
    }

    private void initRecyclerViews() {
        ArrayList<Person> cast = getIntent().getParcelableArrayListExtra("cast");
        ArrayList<Person> crew = getIntent().getParcelableArrayListExtra("crew");
        castRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        crewRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        castRecyclerView.setAdapter(new PeopleAdapter(this, cast));
        crewRecyclerView.setAdapter(new PeopleAdapter(this, crew));
    }

    private void openAddReviewActivity() {
        String userId = sharedPreferences.getString("userId", null);
        if (userId == null) {
            Toast.makeText(this, "You must be logged in to add a review.", Toast.LENGTH_SHORT).show();
            return;
        }
        Intent intent = new Intent(this, AddReviewActivity.class);
        intent.putExtra("movieId", movieId);
        startActivity(intent);
    }

    private void openReviewsActivity() {
        Intent intent = new Intent(this, ReviewsActivity.class);
        intent.putExtra("movieId", movieId);
        startActivity(intent);
    }

    private void setupNavigationMenu(NavigationView navigationView) {
        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_home) {
                startActivity(new Intent(this, MainActivity.class));
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_watchlist) {
                Intent intent = new Intent(this, WatchlistActivity.class);
                startActivity(intent);
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_watched) {
                Intent intent = new Intent(this, WatchedActivity.class);
                startActivity(intent);
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_logout) {
                navigationManager.logout();
                return true;
            }
            return false;
        });
    }

    private void addToWatchlist() {
        String userId = sharedPreferences.getString("userId", null);
        if (userId == null) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show();
            return;
        }
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        WatchlistAddRequest request = new WatchlistAddRequest(
                userId, movieId, getIntent().getStringExtra("title"), getIntent().getStringExtra("posterPath"));
        apiService.addToWatchlist(request).enqueue(new Callback<WatchlistAddResponse>() {
            @Override
            public void onResponse(Call<WatchlistAddResponse> call, Response<WatchlistAddResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(MovieDetailsActivity.this, "Added to watchlist", Toast.LENGTH_SHORT).show();
                } else if (response.code() == 409) {
                    Toast.makeText(MovieDetailsActivity.this, "Movie already in watchlist", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MovieDetailsActivity.this, "Failed to add to watchlist: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<WatchlistAddResponse> call, Throwable t) {
                Toast.makeText(MovieDetailsActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    private void addToWatched() {
        String userId = sharedPreferences.getString("userId", null);
        if (userId == null) {
            Toast.makeText(this, "User not logged in", Toast.LENGTH_SHORT).show();
            return;
        }
        String title = getIntent().getStringExtra("title");
        String posterPath = getIntent().getStringExtra("posterPath");
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        WatchedAddRequest request = new WatchedAddRequest(userId, movieId, title, posterPath);
        apiService.addToWatched(request).enqueue(new Callback<WatchedAddResponse>() {
            @Override
            public void onResponse(Call<WatchedAddResponse> call, Response<WatchedAddResponse> response) {
                if (response.isSuccessful() && response.body() != null) {
                    Toast.makeText(MovieDetailsActivity.this, "Added to watched list", Toast.LENGTH_SHORT).show();
                } else {
                    Toast.makeText(MovieDetailsActivity.this, "Failed to add to watched list: " + response.code(), Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<WatchedAddResponse> call, Throwable t) {
                Toast.makeText(MovieDetailsActivity.this, "Error: " + t.getMessage(), Toast.LENGTH_SHORT).show();
            }
        });
    }

    // Add your methods for addToWatchlist and addToWatched here, ensuring they handle the SharedPreferences correctly
}
