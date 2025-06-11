document.addEventListener("DOMContentLoaded", () => {
  const themeToggle = document.getElementById("themeToggle");
  // Ensure themeToggle exists before proceeding
  if (!themeToggle) {
    console.warn('Theme toggle button with id "themeToggle" not found.');
    return;
  }

  const themes = ["default", "theme-light", "theme-vibrant", "theme-dark"];
  const THEME_STORAGE_KEY = "plantDexTheme"; // Key for localStorage

  // Function to apply a theme
  function applyTheme(themeName) {
    // Remove all possible theme classes first
    themes.forEach((t) => {
      if (t !== "default") {
        // 'default' usually means no extra class
        document.documentElement.classList.remove(t);
      }
    });
    // Add the new theme class (if not default)
    if (themeName && themeName !== "default") {
      document.documentElement.classList.add(themeName);
    }
    // Save the current theme to localStorage
    localStorage.setItem(THEME_STORAGE_KEY, themeName);
  }

  // Load saved theme from localStorage on page load
  let savedTheme = localStorage.getItem(THEME_STORAGE_KEY);
  if (savedTheme && themes.includes(savedTheme)) {
    applyTheme(savedTheme);
  } else {
    applyTheme(themes[0]); // Apply default theme if nothing saved or invalid
  }

  themeToggle.addEventListener("click", () => {
    let currentSavedTheme =
      localStorage.getItem(THEME_STORAGE_KEY) || themes[0];
    let currentThemeIndex = themes.indexOf(currentSavedTheme);

    let nextThemeIndex = (currentThemeIndex + 1) % themes.length;
    applyTheme(themes[nextThemeIndex]);
  });
});
