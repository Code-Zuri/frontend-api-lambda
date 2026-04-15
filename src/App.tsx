import { useEffect, useState } from "react";

function App() {
  const [mensaje, setMensaje] = useState("");
  const [env, setEnv] = useState<"dev" | "prod">("dev");
  const [isLoading, setIsLoading] = useState(false);
  const [displayText, setDisplayText] = useState("");
  const [currentMessage, setCurrentMessage] = useState("");

  useEffect(() => {
    setIsLoading(true);
    setDisplayText("");
    const url =
      env === "dev"
        ? "https://9b085flf60.execute-api.us-east-1.amazonaws.com/dev/dev"
        : "https://9b085flf60.execute-api.us-east-1.amazonaws.com/prod/prod";

    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setMensaje(data.message);
        setCurrentMessage(data.message);
        setIsLoading(false);
      })
      .catch(() => {
        const errorMsg = "error al conectar";
        setMensaje(errorMsg);
        setCurrentMessage(errorMsg);
        setIsLoading(false);
      });
  }, [env]);

  useEffect(() => {
    if (!currentMessage || isLoading) return;

    let index = 0;
    setDisplayText("");

    const interval = setInterval(() => {
      if (index < currentMessage.length) {
        setDisplayText(currentMessage.slice(0, index + 1));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 150);

    return () => clearInterval(interval);
  }, [currentMessage, isLoading]);

  return (
    <div style={styles.container}>
      <h1 style={styles.title}>Frontend AWS API</h1>

      <div style={styles.buttonContainer}>
        <button
          onClick={() => setEnv("dev")}
          style={{
            ...styles.button,
            ...(env === "dev" ? styles.buttonActive : styles.buttonInactive),
          }}
        >
          DEV
        </button>
        <button
          onClick={() => setEnv("prod")}
          style={{
            ...styles.button,
            ...(env === "prod" ? styles.buttonActive : styles.buttonInactive),
          }}
        >
          PROD
        </button>
      </div>

      <div style={styles.messageContainer}>
        {isLoading ? (
          <span style={styles.loading}>⟳</span>
        ) : (
          <h2 style={styles.message}>
            {displayText}
            <span style={styles.cursor}>|</span>
          </h2>
        )}
      </div>
    </div>
  );
}

const styles: Record<string, React.CSSProperties> = {
  container: {
    minHeight: "100vh",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#0f0f1a",
    fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
    padding: "20px",
  },
  title: {
    color: "#ffffff",
    fontSize: "2.5rem",
    fontWeight: 300,
    letterSpacing: "-0.02em",
    marginBottom: "40px",
  },
  buttonContainer: {
    display: "flex",
    gap: "16px",
    marginBottom: "40px",
  },
  button: {
    padding: "12px 32px",
    border: "1px solid",
    borderRadius: "8px",
    fontSize: "0.875rem",
    fontWeight: 500,
    letterSpacing: "0.05em",
    cursor: "pointer",
    transition: "all 0.2s ease",
    textTransform: "uppercase",
  },
  buttonActive: {
    backgroundColor: "#6366f1",
    borderColor: "#6366f1",
    color: "#ffffff",
    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)",
  },
  buttonInactive: {
    backgroundColor: "transparent",
    borderColor: "#3f3f46",
    color: "#a1a1aa",
  },
  messageContainer: {
    minHeight: "60px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  message: {
    color: "#ffffff",
    fontSize: "1.5rem",
    fontWeight: 400,
    margin: 0,
    fontFamily: "'JetBrains Mono', monospace",
  },
  cursor: {
    color: "#6366f1",
    animation: "blink 1s infinite",
    marginLeft: "2px",
  },
  loading: {
    color: "#6366f1",
    fontSize: "1.5rem",
    animation: "spin 1s linear infinite",
  },
};

export default App;