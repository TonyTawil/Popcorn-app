package com.example.popcorn.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Networking.FetchMoviesTask;
import com.example.popcorn.R;
import com.example.popcorn.Utils.NavigationManager;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {

    private RecyclerView moviesRecyclerView, nowPlayingRecyclerView, upcomingRecyclerView;
    private Button showMoreButton, showMoreNowPlayingButton, showMoreUpcomingButton;
    private DrawerLayout drawerLayout;
    private NavigationManager navigationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.appBarLayout);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false); // Ensures title is not displayed

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);
        navigationManager = new NavigationManager(this, navigationView, drawerLayout);
        navigationManager.updateDrawerContents();

        // Initialize ActionBarDrawerToggle
        ActionBarDrawerToggle toggle = new ActionBarDrawerToggle(
                this, drawerLayout, toolbar,
                R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        toggle.getDrawerArrowDrawable().setColor(getResources().getColor(android.R.color.white));
        // Setup RecyclerViews and Buttons
        setupRecyclerViews();

        showMoreButton.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, MovieListActivity.class)));
        showMoreNowPlayingButton.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, NowPlayingListActivity.class)));
        showMoreUpcomingButton.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, UpcomingListActivity.class)));

        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_logout) {
                navigationManager.logout();
                return true;
            } else if (id == R.id.nav_home) {
                // Restart the MainActivity
                Intent intent = new Intent(MainActivity.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_watchlist) {
                Intent intent = new Intent(MainActivity.this, WatchlistActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_watched) {
                // Handle watched navigation
                return true;
            }

            // If none of the IDs match, you can handle it here or just ignore.
            return false;
        });
    }

    private void setupRecyclerViews() {
        moviesRecyclerView = findViewById(R.id.moviesRecyclerView);
        nowPlayingRecyclerView = findViewById(R.id.nowPlayingRecyclerView);
        upcomingRecyclerView = findViewById(R.id.upcomingRecyclerView);
        showMoreButton = findViewById(R.id.showMoreButton);
        showMoreNowPlayingButton = findViewById(R.id.showMoreNowPlayingButton);
        showMoreUpcomingButton = findViewById(R.id.showMoreUpcomingButton);

        moviesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        nowPlayingRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        upcomingRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        new FetchMoviesTask(moviesRecyclerView, 1, 5, "trending").execute();
        new FetchMoviesTask(nowPlayingRecyclerView, 1, 5, "now_playing").execute();
        new FetchMoviesTask(upcomingRecyclerView, 1, 5, "upcoming").execute();
    }
}
