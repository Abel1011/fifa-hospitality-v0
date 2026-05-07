import type { VoiceKnowledgeStage } from "./contracts";

export type HospitalityCatalogItem = {
  id: string;
  category: "product" | "lounge";
  title: string;
  summary: string;
  purchaseMode: "buy-now" | "inquiry";
  officialHref: string;
  bestFor: string[];
  constraints: string[];
  stages?: VoiceKnowledgeStage[];
  travelPattern?: "single-city" | "multi-city" | "custom";
  hospitalityOptions?: string[];
};

export const hospitalityCatalog: readonly HospitalityCatalogItem[] = [
  {
    id: "single-match",
    category: "product",
    title: "Single Match",
    summary:
      "Best when the guest wants one specific match with official hospitality included.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_match_offerings_single_match",
    bestFor: [
      "One match only",
      "Fixed date or opponent",
      "Lower travel complexity",
    ],
    constraints: [
      "Final is excluded",
      "Availability varies by stage and venue",
    ],
    stages: [
      "group-stage",
      "round-of-32",
      "round-of-16",
      "quarterfinal",
      "semifinal",
      "third-place",
    ],
    travelPattern: "single-city",
    hospitalityOptions: [
      "Pitchside Lounge",
      "VIP",
      "Trophy Lounge",
      "Champions Club",
      "FIFA Pavilion",
    ],
  },
  {
    id: "venue-series",
    category: "product",
    title: "Venue Series",
    summary:
      "Best when the guest wants to stay in one host city and attend every match at that venue.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-bundle?id=VS&src=home_match_offerings_venue_series",
    bestFor: [
      "One city base",
      "Venue-centric travel plan",
      "Multiple matches without changing hotels",
    ],
    constraints: ["Number of matches depends on venue"],
    stages: [
      "group-stage",
      "round-of-32",
      "round-of-16",
      "quarterfinal",
      "semifinal",
      "third-place",
      "final",
    ],
    travelPattern: "single-city",
    hospitalityOptions: [
      "Pitchside Lounge",
      "VIP",
      "Trophy Lounge",
      "Champions Club",
      "FIFA Pavilion",
    ],
  },
  {
    id: "follow-my-team",
    category: "product",
    title: "Follow My Team",
    summary:
      "Best when the guest wants to follow one non-host team across early-stage matches in different locations.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-bundle?id=FMT&src=home_match_offerings_follow_my_team",
    bestFor: [
      "Following a specific team",
      "Multi-city travel",
      "Early-stage supporters itinerary",
    ],
    constraints: [
      "Not available for host nation teams (Canada, Mexico, United States)",
      "Focused on early-stage matches",
    ],
    stages: ["group-stage"],
    travelPattern: "multi-city",
    hospitalityOptions: [
      "Pitchside Lounge",
      "VIP",
      "Trophy Lounge",
      "Champions Club",
      "FIFA Pavilion",
    ],
  },
  {
    id: "multi-match-series",
    category: "product",
    title: "Multi-Match Series",
    summary:
      "Best when the guest wants 4 to 5 matches and a path that can unlock the Final.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?productType=MM&src=home_multi_match_bundle",
    bestFor: [
      "4 to 5 matches",
      "Path to later knockout rounds or Final",
      "Flexible multi-stage itinerary",
    ],
    constraints: [
      "All matches subject to availability",
      "Requires buying 4 to 5 matches",
    ],
    stages: [
      "group-stage",
      "round-of-32",
      "round-of-16",
      "quarterfinal",
      "semifinal",
      "third-place",
      "final",
    ],
    travelPattern: "multi-city",
  },
  {
    id: "private-suites",
    category: "product",
    title: "Private Suites",
    summary:
      "Premium private hospitality for groups that want privacy, direct seating access and dedicated service.",
    purchaseMode: "buy-now",
    officialHref: "https://fifaworldcup26.suites.fifa.com/",
    bestFor: [
      "Private groups",
      "High-touch hosting",
      "Corporate entertaining",
    ],
    constraints: ["Best suited to larger budgets and hosted groups"],
    travelPattern: "custom",
  },
  {
    id: "platinum-access",
    category: "product",
    title: "Platinum Access",
    summary:
      "The highest-tier customized hospitality option, available through inquiry only.",
    purchaseMode: "inquiry",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/en/request-info?src=home_additional_offerings_register_interest",
    bestFor: [
      "Maximum exclusivity",
      "Fully customized hosting",
      "Top-end executive experiences",
    ],
    constraints: ["Inquiry only", "No direct online checkout"],
    travelPattern: "custom",
  },
  {
    id: "accommodations",
    category: "product",
    title: "Accommodations",
    summary:
      "Travel add-on for hotels, experiences and ground arrangements around the match plan.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitalityexperiences.fifa.com/en",
    bestFor: [
      "Travel packaging",
      "Hotel coordination",
      "Support around multi-city itineraries",
    ],
    constraints: ["Complements a match purchase rather than replacing it"],
    travelPattern: "custom",
  },
  {
    id: "pitchside-lounge",
    category: "lounge",
    title: "Pitchside Lounge",
    summary:
      "Premier sideline seating with top-tier culinary and beverage service close to the field.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_lounges_explore",
    bestFor: ["Closest feel to the pitch", "Premium sideline view"],
    constraints: ["Availability varies by venue"],
  },
  {
    id: "vip-lounge",
    category: "lounge",
    title: "VIP",
    summary:
      "Elevated sideline lounge with curated dining and premium beverage service.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_lounges_explore",
    bestFor: ["High-end shared hospitality", "Balanced energy and comfort"],
    constraints: ["Availability varies by venue"],
  },
  {
    id: "trophy-lounge",
    category: "lounge",
    title: "Trophy Lounge",
    summary:
      "Prime sideline seating with elevated hospitality focused on comfort and service.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_lounges_explore",
    bestFor: ["Strong views with premium service"],
    constraints: ["Availability varies by venue"],
  },
  {
    id: "champions-club",
    category: "lounge",
    title: "Champions Club",
    summary:
      "Preferred seating with easy access to exclusive hospitality spaces and elevated amenities.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_lounges_explore",
    bestFor: ["Comfort plus hospitality access"],
    constraints: ["Availability varies by venue"],
  },
  {
    id: "fifa-pavilion",
    category: "lounge",
    title: "FIFA Pavilion",
    summary:
      "Hospitality immediately outside the venue with elevated food and beverage before and after the match.",
    purchaseMode: "buy-now",
    officialHref:
      "https://fifaworldcup26.hospitality.fifa.com/us/en/choose-matches?src=home_lounges_explore",
    bestFor: ["Guests who want hospitality around the venue", "More relaxed pre/post-match experience"],
    constraints: ["Availability varies by venue"],
  },
];