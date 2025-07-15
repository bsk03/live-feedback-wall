import "./src/env.js";

/** @type {import("next").NextConfig} */
const config = {
  experimental: {
    serverComponentsExternalPackages: ["socket.io"],
  },
  middleware: {
    // Wymuszamy Edge Runtime dla middleware
    runtime: "edge",
  },
};

export default config;
