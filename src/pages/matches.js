import { useState } from "react";
import ProfileCard from "@/components/profileCard/profileCard.component";
import { FiSparkles, FiRefreshCw, FiFilter } from "react-icons/fi";
import styles from "../styles/matches.module.css";
import { useEffect } from "react";
import { useNavbar } from "@/context/NavbarContext";

const mockMatches = [
  // same mockMatches data as before
  {
    id: 1,
    name: "Emma",
    location: "San Francisco",
    score: 94,
    imageUrl:
      "https://images.unsplash.com/photo-1494790108755-2616b612b47c?w=400&h=600&fit=crop",
    age: 26,
    bio: "AI-matched personality: Creative, adventurous, loves deep conversations and weekend hikes.",
  },
  {
    id: 2,
    name: "Alex",
    location: "New York",
    score: 89,
    imageUrl:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=600&fit=crop",
    age: 28,
    bio: "Our AI detected perfect compatibility in humor, life goals, and shared interests in tech.",
  },
  {
    id: 3,
    name: "Maya",
    location: "Los Angeles",
    score: 92,
    imageUrl:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=400&h=600&fit=crop",
    age: 25,
    bio: "Personality analysis shows amazing potential for long-term connection and shared values.",
  },
  {
    id: 4,
    name: "Jordan",
    location: "Chicago",
    score: 87,
    imageUrl:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=600&fit=crop",
    age: 30,
    bio: "AI compatibility score based on communication style, lifestyle preferences, and future goals.",
  },
  {
    id: 5,
    name: "Sofia",
    location: "Miami",
    score: 91,
    imageUrl:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&h=600&fit=crop",
    age: 24,
    bio: "Machine learning analysis found exceptional compatibility in values, humor, and life vision.",
  },
  {
    id: 6,
    name: "Ryan",
    location: "Seattle",
    score: 88,
    imageUrl:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&h=600&fit=crop",
    age: 29,
    bio: "AI profile matching detected strong potential for meaningful connection and shared interests.",
  },
];

export default function MatchesScreen() {
  const { updateNavbar, resetNavbar } = useNavbar();
  useEffect(() => {
    updateNavbar({
      title: "matches",
      subtitle: "Online",
      avatar: false,
      // showFilter: false,
    });
    return () => resetNavbar();
  }, []);
  return (
    <div className={styles.container}>
      {mockMatches.map((profile) => (
        <ProfileCard
          key={profile.id}
          name={profile.name}
          age={profile.age}
          location={profile.location}
          matchPercent={profile.matchPercent}
          description={profile.description}
        />
      ))}
    </div>
  );
}
