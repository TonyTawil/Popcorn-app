package com.example.popcorn.Adapters;

import android.content.Context;
import android.content.Intent;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.example.popcorn.Activities.MovieDetailsActivity;
import com.example.popcorn.Models.Movie;
import com.example.popcorn.Networking.FetchWatchlistTask;
import com.example.popcorn.R;

import java.util.List;

public class MoviesAdapter extends RecyclerView.Adapter<MoviesAdapter.MovieViewHolder> {
    private Context context;
    private List<Movie> movieList;
    private boolean showDeleteIcon;
    private FetchWatchlistTask fetchWatchlistTask; // Add this to handle the deletion

    public MoviesAdapter(Context context, List<Movie> movieList, boolean showDeleteIcon) {
        this.context = context;
        this.movieList = movieList;
        this.showDeleteIcon = showDeleteIcon;
        this.fetchWatchlistTask = new FetchWatchlistTask(null, "", context); // Initialize with null since RecyclerView isn't used directly here
    }

    @Override
    public MovieViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.movie_item, parent, false);
        return new MovieViewHolder(view);
    }

    @Override
    public void onBindViewHolder(MovieViewHolder holder, int position) {
        Movie movie = movieList.get(position);
        holder.titleTextView.setText(movie.getTitle());
        Glide.with(context).load(movie.getPosterPath()).into(holder.posterImageView);

        holder.itemView.setOnClickListener(v -> {
            Intent intent = new Intent(context, MovieDetailsActivity.class);
            intent.putExtra("movieId", movie.getMovieId());
            intent.putExtra("title", movie.getTitle());
            intent.putExtra("posterPath", movie.getPosterPath());
            context.startActivity(intent);
        });

        if (showDeleteIcon) {
            holder.removeIcon.setVisibility(View.VISIBLE);
            holder.removeIcon.setOnClickListener(v -> {
                String userId = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE).getString("userId", null);
                if (userId != null) {
                    fetchWatchlistTask.removeMovieFromWatchlist(userId, movie.getMovieId(), () -> {
                        movieList.remove(position);
                        notifyItemRemoved(position);
                        notifyItemRangeChanged(position, movieList.size());
                    });
                }
            });
        } else {
            holder.removeIcon.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return movieList != null ? movieList.size() : 0;
    }

    public static class MovieViewHolder extends RecyclerView.ViewHolder {
        TextView titleTextView;
        ImageView posterImageView;
        ImageView removeIcon; // Icon for removing a movie from the watchlist

        public MovieViewHolder(View itemView) {
            super(itemView);
            titleTextView = itemView.findViewById(R.id.titleTextView);
            posterImageView = itemView.findViewById(R.id.posterImageView);
            removeIcon = itemView.findViewById(R.id.remove_icon); // Reference to the delete icon in the layout
        }
    }
}
