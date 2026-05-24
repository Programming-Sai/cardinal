import { createRoot } from "react-dom/client";
import favicon from "./assets/favicon.ico";
import logo from "./assets/logo-dark.png";
import App from "./app/App.tsx";
import "./styles/index.css";

const setLinkTag = (rel: string, href: string) => {
  const existing = document.querySelector(
    `link[rel="${rel}"]`,
  ) as HTMLLinkElement | null;
  const tag = existing ?? document.createElement("link");

  tag.rel = rel;
  tag.href = href;

  if (!existing) {
    document.head.appendChild(tag);
  }
};

document.title = "Cardinal Immersions | International Learning Mobility";
setLinkTag("icon", favicon);
setLinkTag("apple-touch-icon", logo);

createRoot(document.getElementById("root")!).render(<App />);
