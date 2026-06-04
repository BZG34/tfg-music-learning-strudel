tailwind.config = {
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        "surface-container-highest": "#353436",
        "inverse-on-surface": "#313031",
        "primary-container": "#00ff41",
        "surface-bright": "#3a393a",
        secondary: "#d3fbff",
        "secondary-fixed": "#7df4ff",
        "on-error": "#690005",
        "outline-variant": "#3b4b37",
        "primary-fixed-dim": "#00e639",
        "secondary-fixed-dim": "#00dbe9",
        tertiary: "#fff7f9",
        "on-tertiary-fixed": "#380038",
        "on-surface": "#e5e2e3",
        "on-primary-container": "#007117",
        "inverse-primary": "#006e16",
        error: "#ffb4ab",
        surface: "#131314",
        "on-primary": "#003907",
        "on-tertiary-container": "#ad00ad",
        "surface-dim": "#131314",
        "tertiary-fixed": "#ffd7f5",
        "secondary-container": "#00eefc",
        "on-surface-variant": "#b9ccb2",
        "surface-container-lowest": "#0e0e0f",
        primary: "#ebffe2",
        "surface-container-low": "#1c1b1c",
        "tertiary-container": "#ffcef4",
        background: "#131314",
        "on-background": "#e5e2e3",
        "on-secondary": "#00363a",
        "surface-container": "#201f20",
        "primary-fixed": "#72ff70",
        "surface-container-high": "#2a2a2b",
        "surface-tint": "#00e639",
        outline: "#84967e",
        "on-error-container": "#ffdad6",
        "tertiary-fixed-dim": "#ffabf3",
        "on-tertiary": "#5b005b",
        "on-secondary-fixed-variant": "#004f54",
        "inverse-surface": "#e5e2e3",
        "on-secondary-fixed": "#002022",
        "on-secondary-container": "#00686f",
        "on-tertiary-fixed-variant": "#810081",
        "error-container": "#93000a",
        "surface-variant": "#353436",
        "on-primary-fixed": "#002203",
        "on-primary-fixed-variant": "#00530e"
      },
      borderRadius: {
        DEFAULT: "0.125rem",
        lg: "0.25rem",
        xl: "0.5rem",
        full: "0.75rem"
      },
      spacing: {
        unit: "8px",
        "beat-gap": "32px",
        gutter: "24px",
        margin: "40px"
      },
      fontFamily: {
        "code-block": ["monospace"],
        "display-lg": ["Space Grotesk"],
        "body-md": ["Inter"],
        "label-caps": ["Space Grotesk"],
        "headline-md": ["Space Grotesk"]
      },
      fontSize: {
        "code-block": ["14px", { lineHeight: "1.6", fontWeight: "400" }],
        "display-lg": [
          "48px",
          { lineHeight: "1.1", letterSpacing: "-0.02em", fontWeight: "700" }
        ],
        "body-md": ["16px", { lineHeight: "1.5", fontWeight: "400" }],
        "label-caps": [
          "12px",
          { lineHeight: "1", letterSpacing: "0.1em", fontWeight: "600" }
        ],
        "headline-md": ["32px", { lineHeight: "1.2", fontWeight: "600" }]
      }
    }
  }
};
