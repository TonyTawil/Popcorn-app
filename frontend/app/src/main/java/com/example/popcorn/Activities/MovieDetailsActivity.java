package com.example.popcorn.Activities;

import android.content.Intent;
import android.os.Bundle;
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
import com.example.popcorn.R;
import com.google.android.material.navigation.NavigationView;

import java.util.List;

public class MovieDetailsActivity extends AppCompatActivity {
    private RecyclerView castRecyclerView, crewRecyclerView;
    private DrawerLayout drawerLayout;
    private ActionBarDrawerToggle toggle;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_movie_details);

        Toolbar toolbar = findViewById(R.id.appBarLayout);
        setSupportActionBar(toolbar);
        getSupportActionBar().setDisplayShowTitleEnabled(false);

        drawerLayout = findViewById(R.id.drawer_layout);
        NavigationView navigationView = findViewById(R.id.nav_view);

        toggle = new ActionBarDrawerToggle(this, drawerLayout, toolbar, R.string.navigation_drawer_open, R.string.navigation_drawer_close);
        drawerLayout.addDrawerListener(toggle);
        toggle.syncState();

        toggle.getDrawerArrowDrawable().setColor(getResources().getColor(android.R.color.white));


        navigationView.setNavigationItemSelectedListener(item -> {
            // Handle navigation view item clicks here.
            int id = item.getItemId();

            if (id == R.id.nav_home) {
                // Restart the MainActivity
                Intent intent = new Intent(this, MainActivity.class);
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
                Intent intent = new Intent(this, SignUpActivity.class);
                startActivity(intent);
            }

            drawerLayout.closeDrawer(GravityCompat.START);
            return true;
        });

        // Existing code to set up views
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
    }
}
