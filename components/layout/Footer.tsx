import { SITE_CONFIG } from "@/config/site";

export default function Footer() {
  return (
    <footer className="text-center py-6 text-gray-500 border-t border-gray-700 mt-10">
      © {new Date().getFullYear()} {SITE_CONFIG.name} — All Rights Reserved.
    </footer>
  );
}
