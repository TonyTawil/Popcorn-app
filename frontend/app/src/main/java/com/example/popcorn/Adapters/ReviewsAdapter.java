package com.example.popcorn.Adapters;

import android.content.Context;
import android.content.SharedPreferences;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import android.widget.Toast;

import androidx.annotation.NonNull;
import androidx.recyclerview.widget.RecyclerView;

import com.example.popcorn.Models.Review;
import com.example.popcorn.Networking.ApiService;
import com.example.popcorn.Networking.RetrofitClient;
import com.example.popcorn.R;
import com.google.gson.JsonObject;

import java.text.SimpleDateFormat;
import java.util.List;
import java.util.Locale;

import okhttp3.ResponseBody;
import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

public class ReviewsAdapter extends RecyclerView.Adapter<ReviewsAdapter.ReviewViewHolder> {
    private List<Review> reviewsList;
    private SimpleDateFormat dateFormat = new SimpleDateFormat("MMM dd, yyyy", Locale.getDefault()); // For date formatting
    private String currentUserId;  // ID of the logged-in user
    private Context context;

    public ReviewsAdapter(List<Review> reviewsList, Context context) {
        this.reviewsList = reviewsList;
        this.context = context;
        SharedPreferences prefs = context.getSharedPreferences("MyPrefs", Context.MODE_PRIVATE);
        this.currentUserId = prefs.getString("userId", "");
    }

    @NonNull
    @Override
    public ReviewViewHolder onCreateViewHolder(@NonNull ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.review_item, parent, false);
        return new ReviewViewHolder(view);
    }

    @Override
    public void onBindViewHolder(@NonNull ReviewViewHolder holder, int position) {
        Review review = reviewsList.get(position);
        if (review.getUserId() != null) {
            holder.tvReviewerName.setText(review.getUserId().getUsername()); // Correctly accessing username from User2 object
        } else {
            holder.tvReviewerName.setText("Anonymous"); // Fallback if username is null
        }
        holder.tvReviewText.setText(review.getReviewText());
        if (review.getCreatedAt() != null) {
            holder.tvReviewDate.setText(dateFormat.format(review.getCreatedAt())); // Formatting the date
        } else {
            holder.tvReviewDate.setText("No date"); // Fallback if date is null
        }

        // Show edit and delete icons only for the reviews made by the logged-in user
        if (review.getUserId() != null && review.getUserId().getId().equals(currentUserId)) {
            holder.ivEdit.setVisibility(View.VISIBLE);
            holder.ivDelete.setVisibility(View.VISIBLE);

            // Set click listeners for edit and delete icons
            holder.ivEdit.setOnClickListener(v -> {
                // Handle edit review
            });

            holder.ivDelete.setOnClickListener(v -> {
                String reviewId = reviewsList.get(position).getId();
                JsonObject userIdJson = new JsonObject();
                userIdJson.addProperty("userId", currentUserId);

                ApiService apiService = RetrofitClient.getRetrofitInstance().create(ApiService.class);
                Call<ResponseBody> call = apiService.deleteReview(reviewId, userIdJson);
                call.enqueue(new Callback<ResponseBody>() {
                    @Override
                    public void onResponse(Call<ResponseBody> call, Response<ResponseBody> response) {
                        if (response.isSuccessful()) {
                            Toast.makeText(context, "Review deleted successfully.", Toast.LENGTH_SHORT).show();
                            // Remove the review from the list and notify the adapter
                            reviewsList.remove(position);
                            notifyItemRemoved(position);
                        } else {
                            Toast.makeText(context, "Failed to delete review: " + response.message(), Toast.LENGTH_SHORT).show();
                        }
                    }

                    @Override
                    public void onFailure(Call<ResponseBody> call, Throwable t) {
                        Toast.makeText(context, "Error deleting review: " + t.getMessage(), Toast.LENGTH_SHORT).show();
                    }
                });
            });

        } else {
            holder.ivEdit.setVisibility(View.GONE);
            holder.ivDelete.setVisibility(View.GONE);
        }
    }

    @Override
    public int getItemCount() {
        return reviewsList.size();
    }

    public static class ReviewViewHolder extends RecyclerView.ViewHolder {
        TextView tvReviewerName, tvReviewText, tvReviewDate;
        ImageView ivEdit, ivDelete;

        public ReviewViewHolder(@NonNull View itemView) {
            super(itemView);
            tvReviewerName = itemView.findViewById(R.id.tvReviewerName);
            tvReviewText = itemView.findViewById(R.id.tvReviewText);
            tvReviewDate = itemView.findViewById(R.id.tvReviewDate);
            ivEdit = itemView.findViewById(R.id.ivEdit);
            ivDelete = itemView.findViewById(R.id.ivDelete);
        }
    }
}
