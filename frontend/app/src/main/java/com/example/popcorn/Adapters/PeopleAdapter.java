package com.example.popcorn.Adapters;

import android.content.Context;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;
import androidx.recyclerview.widget.RecyclerView;
import com.bumptech.glide.Glide;
import com.example.popcorn.Models.Person;
import com.example.popcorn.R;

import java.util.List;

public class PeopleAdapter extends RecyclerView.Adapter<PeopleAdapter.PersonViewHolder> {
    private List<Person> people;
    private Context context;

    public PeopleAdapter(Context context, List<Person> people) {
        this.context = context;
        this.people = people;
    }

    @Override
    public PersonViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View view = LayoutInflater.from(parent.getContext()).inflate(R.layout.person_item, parent, false);
        return new PersonViewHolder(view);
    }

    @Override
    public void onBindViewHolder(PersonViewHolder holder, int position) {
        Person person = people.get(position);
        holder.nameTextView.setText(person.getName());
        holder.roleTextView.setText(person.getRole());
        if (person.getImageUrl() != null && !person.getImageUrl().isEmpty()) {
            Glide.with(context).load(person.getImageUrl()).placeholder(R.drawable.placeholder).into(holder.personImageView);
        } else {
            holder.personImageView.setImageResource(R.drawable.placeholder); // Default placeholder if no image
        }
    }

    @Override
    public int getItemCount() {
        return people != null ? people.size() : 0;
    }

    public static class PersonViewHolder extends RecyclerView.ViewHolder {
        TextView nameTextView, roleTextView;
        ImageView personImageView;

        public PersonViewHolder(View itemView) {
            super(itemView);
            nameTextView = itemView.findViewById(R.id.nameTextView);
            roleTextView = itemView.findViewById(R.id.roleTextView);
            personImageView = itemView.findViewById(R.id.personImageView);
        }
    }
}
