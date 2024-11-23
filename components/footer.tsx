import { FaGithub, FaTwitter, FaLinkedin } from "react-icons/fa";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-center text-sm text-muted-foreground">
          <p>
            Built by{" "}
            <a
              href="https://github.com/antonio-abrantes"
              target="_blank"
              rel="noopener noreferrer"
              className="font-medium underline hover:text-primary"
            >
              Antonio Abrantes
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
