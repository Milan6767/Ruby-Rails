import React, { useEffect, useState } from "react";

const API_BASE = "http://127.0.0.1:3000";

export default function App() {
  const [token, setToken] = useState(localStorage.getItem("issue_board_token") || "");
  const [user, setUser] = useState(null);
  const [issues, setIssues] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({
    email: "newuser@test.com",
    password: "123456",
  });

  const [issueForm, setIssueForm] = useState({
    title: "",
    description: "",
    status: "open",
    project_id: 1,
  });
useEffect(() => {
  if (!token) {
    queueMicrotask(() => {
      setUser(null);
      setIssues([]);
    });
  }
}, [token]);     
useEffect(() => {
  if (!token) return;

  localStorage.setItem("issue_board_token", token);
  fetchMe(token);
  fetchIssues(token);
}, [token]);

  async function fetchJson(url, options = {}) {
    const response = await fetch(url, options);
    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      throw new Error(data.error || data.errors?.join(", ") || "Request failed");
    }

    return data;
  }

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const data = await fetchJson(`${API_BASE}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginForm),
      });

      setToken(data.token);
      setMessage("Sikeres bejelentkezés.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function fetchMe(currentToken = token) {
    try {
      const data = await fetchJson(`${API_BASE}/me`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      setUser(data);
    } catch (error) {
      setMessage(error.message);
      setToken("");
    }
  }

  async function fetchIssues(currentToken = token) {
    try {
      const data = await fetchJson(`${API_BASE}/issues`, {
        headers: {
          Authorization: `Bearer ${currentToken}`,
        },
      });

      setIssues(Array.isArray(data) ? data : []);
    } catch (error) {
      setMessage(error.message);
    }
  }

  async function handleCreateIssue(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await fetchJson(`${API_BASE}/issues`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...issueForm,
          project_id: Number(issueForm.project_id),
        }),
      });

      setIssueForm({
        title: "",
        description: "",
        status: "open",
        project_id: 1,
      });

      setMessage("Issue létrehozva.");
      fetchIssues();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  async function updateIssueStatus(id, status) {
    setLoading(true);
    setMessage("");

    try {
      await fetchJson(`${API_BASE}/issues/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status }),
      });

      setMessage("Issue frissítve.");
      fetchIssues();
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  }

  function logout() {
    setToken("");
    setMessage("Kijelentkeztél.");
  }

  return (
    <div style={styles.page}>
      <div style={styles.container}>
        <h1>Issue Board Frontend</h1>
        <p>Minimál React frontend a Rails backendhez.</p>

        {message && <div style={styles.message}>{message}</div>}

        <div style={styles.grid}>
          <div style={styles.leftColumn}>
            <section style={styles.card}>
              <h2>Bejelentkezés</h2>
              <form onSubmit={handleLogin} style={styles.form}>
                <input
                  type="email"
                  placeholder="Email"
                  value={loginForm.email}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, email: e.target.value }))
                  }
                  style={styles.input}
                />
                <input
                  type="password"
                  placeholder="Jelszó"
                  value={loginForm.password}
                  onChange={(e) =>
                    setLoginForm((prev) => ({ ...prev, password: e.target.value }))
                  }
                  style={styles.input}
                />
                <button type="submit" style={styles.button} disabled={loading}>
                  Bejelentkezés
                </button>
              </form>
            </section>

            <section style={styles.card}>
              <h2>Aktuális user</h2>
              {user ? (
                <>
                  <p><strong>ID:</strong> {user.id}</p>
                  <p><strong>Email:</strong> {user.email}</p>
                  <button onClick={logout} style={styles.secondaryButton}>
                    Kijelentkezés
                  </button>
                </>
              ) : (
                <p>Nincs bejelentkezve.</p>
              )}
            </section>

            <section style={styles.card}>
              <h2>Új issue</h2>
              <form onSubmit={handleCreateIssue} style={styles.form}>
                <input
                  type="text"
                  placeholder="Title"
                  value={issueForm.title}
                  onChange={(e) =>
                    setIssueForm((prev) => ({ ...prev, title: e.target.value }))
                  }
                  style={styles.input}
                />

                <textarea
                  placeholder="Description"
                  value={issueForm.description}
                  onChange={(e) =>
                    setIssueForm((prev) => ({
                      ...prev,
                      description: e.target.value,
                    }))
                  }
                  style={styles.textarea}
                />

                <select
                  value={issueForm.status}
                  onChange={(e) =>
                    setIssueForm((prev) => ({ ...prev, status: e.target.value }))
                  }
                  style={styles.input}
                >
                  <option value="open">open</option>
                  <option value="in_progress">in_progress</option>
                  <option value="done">done</option>
                </select>

                <input
                  type="number"
                  placeholder="Project ID"
                  value={issueForm.project_id}
                  onChange={(e) =>
                    setIssueForm((prev) => ({
                      ...prev,
                      project_id: e.target.value,
                    }))
                  }
                  style={styles.input}
                />

                <button
                  type="submit"
                  style={styles.button}
                  disabled={!token || loading}
                >
                  Issue létrehozása
                </button>
              </form>
            </section>
          </div>

          <section style={styles.card}>
            <div style={styles.issuesHeader}>
              <h2>Issue lista</h2>
              <button
                onClick={() => fetchIssues()}
                style={styles.secondaryButton}
                disabled={!token || loading}
              >
                Frissítés
              </button>
            </div>

            {!token ? (
              <p>Előbb jelentkezz be.</p>
            ) : issues.length === 0 ? (
              <p>Nincs még issue.</p>
            ) : (
              <div style={styles.issueList}>
                {issues.map((issue) => (
                  <div key={issue.id} style={styles.issueCard}>
                    <h3>
                      #{issue.id} - {issue.title}
                    </h3>
                    <p><strong>Leírás:</strong> {issue.description || "-"}</p>
                    <p><strong>Státusz:</strong> {issue.status}</p>
                    <p><strong>Projekt:</strong> {issue.project?.name || "-"}</p>
                    <p><strong>User:</strong> {issue.user?.email || "-"}</p>

                    <div style={styles.actions}>
                      <button
                        style={styles.smallButton}
                        onClick={() => updateIssueStatus(issue.id, "open")}
                      >
                        open
                      </button>
                      <button
                        style={styles.smallButton}
                        onClick={() => updateIssueStatus(issue.id, "in_progress")}
                      >
                        in_progress
                      </button>
                      <button
                        style={styles.smallButton}
                        onClick={() => updateIssueStatus(issue.id, "done")}
                      >
                        done
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: {
    minHeight: "100vh",
    background: "#f3f4f6",
    padding: "24px",
    fontFamily: "Arial, sans-serif",
  },
  container: {
    maxWidth: "1200px",
    margin: "0 auto",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "350px 1fr",
    gap: "24px",
    alignItems: "start",
  },
  leftColumn: {
    display: "flex",
    flexDirection: "column",
    gap: "20px",
  },
  card: {
    background: "white",
    borderRadius: "12px",
    padding: "20px",
    boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
  },
  textarea: {
    padding: "10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    fontSize: "14px",
    minHeight: "90px",
  },
  button: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "none",
    background: "#111827",
    color: "white",
    cursor: "pointer",
  },
  secondaryButton: {
    padding: "10px 14px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "white",
    cursor: "pointer",
  },
  smallButton: {
    padding: "8px 10px",
    borderRadius: "8px",
    border: "1px solid #d1d5db",
    background: "#f9fafb",
    cursor: "pointer",
  },
  message: {
    margin: "16px 0",
    background: "#e5e7eb",
    padding: "12px",
    borderRadius: "8px",
  },
  issueList: {
    display: "flex",
    flexDirection: "column",
    gap: "16px",
  },
  issueCard: {
    border: "1px solid #e5e7eb",
    borderRadius: "12px",
    padding: "16px",
  },
  actions: {
    display: "flex",
    gap: "8px",
    marginTop: "12px",
    flexWrap: "wrap",
  },
  issuesHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },
};