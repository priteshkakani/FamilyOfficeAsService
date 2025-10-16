module.exports = {
  extends: "@istanbuljs/nyc-config-babel",
  all: true,
  include: ["src/components/**/*.jsx", "src/pages/**/*.jsx"],
  reporter: ["html", "text-summary"],
  reportDir: "./coverage",
};
