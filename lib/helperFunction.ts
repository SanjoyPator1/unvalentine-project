// Function to generate a random avatar URL using DiceBear
export const getRandomAvatar = (seed: string) => {
    const styles = [
      "adventurer",
      "avataaars",
      "bottts",
      "fun-emoji",
      "open-peeps",
      "big-ears",
      "big-smile",
      "croodles",
      "identicon",
      "initials",
      "lorelei",
      "micah",
      "miniavs",
      "notionists",
      "personas",
      "pixel-art",
      "pixel-art-neutral",
    ];
    // Remove Math.random() to keep consistency
    const index = seed.charCodeAt(0) % styles.length;
    return `https://api.dicebear.com/7.x/${styles[index]}/svg?seed=${seed}`;
  };