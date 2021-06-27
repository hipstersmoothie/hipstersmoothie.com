const CopyPlugin = require("copy-webpack-plugin");
const path = require("path");

module.exports = {
  future: {
    webpack5: true,
  },
  webpack: (config) => {
    // Important: return the modified config
    config.plugins.push(
      new CopyPlugin({
        patterns: [
          {
            from: "pages/garden/public",
            to: path.join(__dirname, "public/images"),
          },
        ],
      })
    );

    return config;
  },
};
