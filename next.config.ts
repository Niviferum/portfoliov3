import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Export statique : un fichier HTML par route, hebergeable sur n'importe
  // quel serveur de fichiers. Les en-tetes de securite sont generes apres le
  // build (out/_headers, out/serve.json) : `headers()` n'a aucun effet ici.
  output: "export",
  trailingSlash: true,
  images: { unoptimized: true },
  reactCompiler: true,
  poweredByHeader: false,
};

export default nextConfig;
