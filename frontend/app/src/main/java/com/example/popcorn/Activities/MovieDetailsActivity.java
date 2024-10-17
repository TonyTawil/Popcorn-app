package com.example.popcorn.Activities;

import android.content.Intent;
import android.os.Bundle;
import android.widget.Button;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.appcompat.app.ActionBarDrawerToggle;
import androidx.appcompat.app.AppCompatActivity;
import androidx.appcompat.widget.Toolbar;
import androidx.core.view.GravityCompat;
import androidx.drawerlayout.widget.DrawerLayout;
import androidx.recyclerview.widget.LinearLayoutManager;
import androidx.recyclerview.widget.RecyclerView;

import com.bumptech.glide.Glide;
import com.example.popcorn.Adapters.PeopleAdapter;
import com.example.popcorn.Models.Person;
import com.example.popcorn.Networking.FetchMoviesTask;
import com.example.popcorn.R;
import com.example.popcorn.Utils.NavigationManager;
import com.google.android.material.navigation.NavigationView;

import java.util.List;

public class MovieDetailsActivity extends AppCompatActivity {
    private RecyclerView castRecyclerView, crewRecyclerView;
    private DrawerLayout drawerLayout;
    private NavigationManager navigationManager;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_details);

        Toolbar toolbar = findViewById(R.id.appBarLayout);
        setSupportActionBar(toolbar);
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

        ImageView moviePosterImageView = findViewById(R.id.moviePosterImageView);
        TextView movieTitleTextView = findViewById(R.id.movieTitleTextView);
        TextView moviePlotTextView = findViewById(R.id.moviePlotTextView);
        castRecyclerView = findViewById(R.id.castRecyclerView);
        crewRecyclerView = findViewById(R.id.crewRecyclerView);

        Intent intent = getIntent();
        String title = intent.getStringExtra("title");
        String posterPath = intent.getStringExtra("posterPath");
        String plot = intent.getStringExtra("plot");
        List<Person> cast = intent.getParcelableArrayListExtra("cast");
        List<Person> crew = intent.getParcelableArrayListExtra("crew");

        movieTitleTextView.setText(title);
        moviePlotTextView.setText(plot);
        Glide.with(this).load(posterPath).into(moviePosterImageView);

        castRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        crewRecyclerView.setLayoutManager(new LinearLayoutManager(this));
        castRecyclerView.setAdapter(new PeopleAdapter(this, cast));
        crewRecyclerView.setAdapter(new PeopleAdapter(this, crew));

        navigationView.setNavigationItemSelectedListener(item -> {
            int id = item.getItemId();
            if (id == R.id.nav_logout) {
                navigationManager.logout();
                return true;
            } else if (id == R.id.nav_home) {
                // Restart the MainActivity
                Intent intent2 = new Intent(this, MainActivity.class);
                intent2.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP | Intent.FLAG_ACTIVITY_NEW_TASK);
                startActivity(intent2);
                drawerLayout.closeDrawer(GravityCompat.START);
                return true;
            } else if (id == R.id.nav_watchlist) {
                // Handle watchlist navigation
                return true;
            } else if (id == R.id.nav_watched) {
                // Handle watched navigation
                return true;
            }

            // If none of the IDs match, you can handle it here or just ignore.
            return false;
        });
    }
}
