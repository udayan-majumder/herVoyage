export async function getCityTravelContent(cityName) {
  try {
    const wiki = await fetch(
      `https://en.wikipedia.org/api/rest_v1/page/summary/${cityName}`,
    );

    const wikiData = await wiki.json();

    return {
      shortBlurb:
        wikiData.extract || "A great destination for solo female travelers.",

      highlights: [
        "Local sightseeing",
        "Food exploration",
        "Cultural experiences",
      ],

      itinerary: [
        {
          day: "Day 1",
          title: "Explore City Center",
          plan: [
            "Visit main attractions",
            "Explore local markets",
            "Try local food",
          ],
        },
        {
          day: "Day 2",
          title: "Hidden Gems",
          plan: ["Visit museums", "Walk around neighborhoods"],
        },
      ],

      safetyTips: [
        "Avoid isolated areas at night",
        "Use trusted transport",
        "Share location with family",
      ],

      vibe: ["Culture", "Food", "City"],
      budget: "$$",
    };
  } catch {
    return null;
  }
}
