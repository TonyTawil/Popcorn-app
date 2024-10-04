package com.example.popcorn.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Networking.FetchMoviesTask;
import com.example.popcorn.R;
import com.google.android.material.navigation.NavigationView;

public class MainActivity extends AppCompatActivity {

    private RecyclerView moviesRecyclerView, nowPlayingRecyclerView, upcomingRecyclerView;
    private Button showMoreButton, showMoreNowPlayingButton, showMoreUpcomingButton;
    private DrawerLayout drawerLayout;
    private ActionBarDrawerToggle toggle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);

        Toolbar toolbar = findViewById(R.id.appBarLayout);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);  // Disable the default title

        // Manually add logo to Toolbar
        ImageView logoImageView = new ImageView(this);
        logoImageView.setImageResource(R.drawable.logo);
        Toolbar.LayoutParams layoutParams = new Toolbar.LayoutParams(Toolbar.LayoutParams.WRAP_CONTENT, Toolbar.LayoutParams.WRAP_CONTENT);
        layoutParams.gravity = android.view.Gravity.CENTER;
        toolbar.addView(logoImageView, layoutParams);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);

        // Setup ActionBarDrawerToggle
        toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        toggle.getDrawerArrowDrawable().setColor(getResources().getColor(android.R.color.white));

        navigationView.setNavigationItemSelectedListener(item -> {
            // Handle navigation view item clicks here.
            int id = item.getItemId();

            if (id == R.id.nav_home) {
                // Restart the MainActivity
                Intent intent = new Intent(MainActivity.this, MainActivity.class);
                intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent);
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_contact) {
                // Handle the contact us action
            } else if (id == R.id.nav_about) {
                // Handle the about us action
            } else if (id == R.id.nav_signup) {
                // Start the SignUpActivity
                Intent intent = new Intent(MainActivity.this, SignUpActivity.class);
                startActivity(intent);
            }

            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });

        // Initialize RecyclerViews and Buttons
        moviesRecyclerView = findViewById(R.id.moviesRecyclerView);
        nowPlayingRecyclerView = findViewById(R.id.nowPlayingRecyclerView);
        upcomingRecyclerView = findViewById(R.id.upcomingRecyclerView);
        showMoreButton = findViewById(R.id.showMoreButton);
        showMoreNowPlayingButton = findViewById(R.id.showMoreNowPlayingButton);
        showMoreUpcomingButton = findViewById(R.id.showMoreUpcomingButton);

        // Set LayoutManagers
        moviesRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        nowPlayingRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        upcomingRecyclerView.setLayoutManager(new LinearLayoutManager(this));

        // Fetch data
        new FetchMoviesTask(moviesRecyclerView, 1, 5, "trending").execute();
        new FetchMoviesTask(nowPlayingRecyclerView, 1, 5, "now_playing").execute();
        new FetchMoviesTask(upcomingRecyclerView, 1, 5, "upcoming").execute();

        // Set onClickListeners for Show More buttons
        showMoreButton.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, MovieListActivity.class)));
        showMoreNowPlayingButton.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, NowPlayingListActivity.class)));
        showMoreUpcomingButton.setOnClickListener(v -> startActivity(new Intent(MainActivity.this, UpcomingListActivity.class)));
    }
}
