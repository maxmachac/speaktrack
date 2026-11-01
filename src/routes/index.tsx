import { useEffect, useState } from "react";
import { createFileRoute } from "@tanstack/react-router";

type Theme = "dark" | "light";

type TopicsResponse = {
  topics?: unknown[];
};

export const Route = createFileRoute("/")({ component: SpeakTrackPage });

function SpeakTrackPage() {
  const [theme, setTheme] = useState<Theme>(() => {
    const savedTheme = window.localStorage.getItem("speaktrack-theme");
    return savedTheme === "light" || savedTheme === "dark" ? savedTheme : "dark";
  });
  const [topics, setTopics] = useState<string[]>([]);
  const [loadError, setLoadError] = useState("");
  const [struckTopics, setStruckTopics] = useState<Set<number>>(() => new Set());

  useEffect(() => {
    document.body.dataset.theme = theme;
    window.localStorage.setItem("speaktrack-theme", theme);
  }, [theme]);

  useEffect(() => {
    let active = true;

    async function loadTopics() {
      try {
        const response = await fetch("/topics.json", { cache: "no-store" });
        if (!response.ok) {
          throw new Error(`Could not load topics.json (HTTP ${response.status}).`);
        }

        const data = (await response.json()) as TopicsResponse;
        const topicList = Array.isArray(data.topics) ? data.topics : [];
        const visibleTopics = topicList
          .filter((topic) => topic !== null && topic !== undefined)
          .map(String)
          .filter((topic) => topic.trim() !== "");

        if (active) setTopics(visibleTopics);
      } catch (error) {
        if (active) {
          setLoadError(
            error instanceof Error ? error.message : "Could not read topics from topics.json.",
          );
        }
      }
    }

    void loadTopics();
    return () => {
      active = false;
    };
  }, []);

  function toggleTopic(position: number) {
    setStruckTopics((current) => {
      const next = new Set(current);
      if (next.has(position)) next.delete(position);
      else next.add(position);
      return next;
    });
  }

  return (
    <>
      <header className="header">
        <h1 className="title">SpeakTrack</h1>
        <label className="theme-control">
          <span>Dark mode</span>
          <span className="theme-icon" aria-hidden="true">
            {theme === "dark" ? "☾" : "☀"}
          </span>
          <input
            className="theme-switch"
            type="checkbox"
            role="switch"
            aria-label="Dark mode"
            checked={theme === "dark"}
            onChange={(event) => setTheme(event.currentTarget.checked ? "dark" : "light")}
          />
        </label>
      </header>
      <main className="page-content">
        {loadError ? (
          <p className="topic-item message" role="alert">
            {loadError}
          </p>
        ) : topics.length === 0 ? (
          <p className="topic-item message" aria-live="polite">
            No topics found in topics.json.
          </p>
        ) : (
          <div className="topic-container" aria-label="Topics">
            {topics.map((topic, index) => {
              const isStruckThrough = struckTopics.has(index + 1);
              return (
                <button
                  key={`${index}-${topic}`}
                  type="button"
                  className={`topic-item${isStruckThrough ? " is-struck-through" : ""}`}
                  aria-pressed={isStruckThrough}
                  onClick={() => toggleTopic(index + 1)}
                >
                  {topic}
                </button>
              );
            })}
          </div>
        )}
      </main>
    </>
  );
}
