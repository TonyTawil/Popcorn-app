package com.example.popcorn.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.widget.Toast;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Adapters.ReviewsAdapter;
import com.example.popcorn.Models.Reply;
import com.example.popcorn.Models.Review;
import com.example.popcorn.Networking.ApiService;
import com.example.popcorn.Networking.RetrofitClient;
import com.example.popcorn.R;
import com.example.popcorn.Utils.NavigationManager;
import com.google.android.material.navigation.NavigationView;
import com.google.gson.Gson;
import com.google.gson.JsonArray;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.reflect.TypeToken;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReviewsActivity extends AppCompatActivity {
    private static final String TAG = "ReviewsActivity";
    private RecyclerView reviewsRecyclerView;
    private ReviewsAdapter reviewsAdapter;
    private int movieId;
    private DrawerLayout drawerLayout;
    private NavigationManager navigationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_reviews);

        Toolbar toolbar = findViewById(R.id.appBarLayout);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayHomeAsUpEnabled(true);
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationManager = new NavigationManager(this, navigationView, drawerLayout);
        navigationManager.updateDrawerContents();

        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        toggle.getDrawerArrowDrawable().setColor(getResources().getColor(android.R.color.white));

        Intent intent = getIntent();
        movieId = intent.getIntExtra("movieId", -1);
        if (movieId == -1) {
            finish();  // Close activity if no valid movie ID is found
            return;
        }

        reviewsRecyclerView = findViewById(R.id.reviewsRecyclerView);
        reviewsRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        loadReviews();
    }

    private void loadReviews() {
        ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
        Call<List<Review>> call = apiService.getReviewsByMovieId(movieId);
        call.enqueue(new Callback<List<Review>>() {
            @Override
            public void onResponse(Call<List<Review>> call, Response<List<Review>> response) {
                if (response.isSuccessful() && response.body() != null) {
                    List<Review> reviews = response.body(); // Direct deserialization
                    if (reviews.isEmpty()) {
                        Toast.makeText(ReviewsActivity.this, "No reviews available.", Toast.LENGTH_SHORT).show();
                    } else {
                        reviewsAdapter = new ReviewsAdapter(reviews);
                        reviewsRecyclerView.setAdapter(reviewsAdapter);
                    }
                } else {
                    Log.e(TAG, "Failed to fetch reviews: HTTP " + response.code() + " - " + response.message());
                    Toast.makeText(ReviewsActivity.this, "Failed to fetch reviews.", Toast.LENGTH_SHORT).show();
                }
            }

            @Override
            public void onFailure(Call<List<Review>> call, Throwable t) {
                Log.e(TAG, "Error fetching reviews: " + t.getMessage());
                Toast.makeText(ReviewsActivity.this, "Error fetching reviews.", Toast.LENGTH_LONG).show();
            }
        });
    }



    private String parseUserId(JsonObject jsonObject) {
        try {
            if (jsonObject.has("userId") && !jsonObject.get("userId").isJsonNull()) {
                JsonElement userIdElement = jsonObject.get("userId");
                Log.d(TAG, "userId element: " + userIdElement.toString()); // Log the actual userId JSON

                if (userIdElement.isJsonPrimitive()) {
                    return userIdElement.getAsString();
                } else if (userIdElement.isJsonObject()) {
                    JsonObject userIdObject = userIdElement.getAsJsonObject();
                    if (userIdObject.has("$oid")) {
                        return userIdObject.get("$oid").getAsString();
                    }
                }
            }
        } catch (Exception e) {
            Log.e(TAG, "Error parsing userId", e);
        }
        return null;
    }


    @Override
    public boolean onOptionsItemSelected(android.view.MenuItem item) {
        if (item.getItemId() == android.R.id.home) {
            drawerLayout.openDrawer(GravityCompat.START);
            return true;
        }
        return super.onOptionsItemSelected(item);
    }
}
