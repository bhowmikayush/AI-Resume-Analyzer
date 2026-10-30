
import React, { useCallback, useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:3000"
).replace(/\/$/, "");

const api = axios.create({
  baseURL: `${API_URL}/api`,
  withCredentials: true,
});

const getErrorMessage = (error) =>
  error.response?.data?.message ||
  error.message ||
  "Something went wrong. Please try again.";

const getInitials = (username = "") =>
  username
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("") || "U";

const formatDate = (date) => {
  if (!date) return "—";

  const parsed = new Date(date);

  return Number.isNaN(parsed.getTime())
    ? "—"
    : parsed.toLocaleDateString("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      });
};

export default function AdminUsers() {
  const navigate = useNavigate();

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [notice, setNotice] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [confirmUser, setConfirmUser] = useState(null);

  const [form, setForm] = useState({
    username: "",
    email: "",
    role: "user",
  });

  const notify = (message, type = "success") => {
    setNotice({ message, type });
  };

  const loadUsers = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/admin/users");

      setUsers(response.data.users || []);
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
        return;
      }

      if (error.response?.status === 403) {
        notify("Access denied. Only administrators can manage users.", "error");
        return;
      }

      notify(getErrorMessage(error), "error");
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase();

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.username?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        String(user._id).toLowerCase().includes(query);

      const matchesRole =
        roleFilter === "all" || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, search, roleFilter]);

  const adminCount = users.filter((user) => user.role === "admin").length;
  const regularCount = users.filter((user) => user.role === "user").length;

  const openEdit = (user) => {
    setEditingUser(user);

    setForm({
      username: user.username || "",
      email: user.email || "",
      role: user.role || "user",
    });
  };

  const closeEdit = () => {
    if (saving) return;

    setEditingUser(null);
    setForm({ username: "", email: "", role: "user" });
  };

  const handleUpdate = async (event) => {
    event.preventDefault();

    if (!editingUser) return;

    const username = form.username.trim();
    const email = form.email.trim();

    if (!username || !email) {
      notify("Username and email are required.", "error");
      return;
    }

    setSaving(true);

    try {
      const response = await api.patch(
        `/admin/users/${editingUser._id}`,
        {
          username,
          email,
          role: form.role,
        }
      );

      const updatedUser = response.data.user;

      setUsers((current) =>
        current.map((user) =>
          user._id === editingUser._id ? updatedUser : user
        )
      );

      setEditingUser(null);
      notify("User updated successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        notify(getErrorMessage(error), "error");
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmUser) return;

    const userId = confirmUser._id;
    setDeletingId(userId);

    try {
      await api.delete(`/admin/users/${userId}`);

      setUsers((current) =>
        current.filter((user) => user._id !== userId)
      );

      setConfirmUser(null);
      notify("User deleted successfully.");
    } catch (error) {
      if (error.response?.status === 401) {
        navigate("/login", { replace: true });
      } else {
        notify(getErrorMessage(error), "error");
      }
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="admin-page">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&family=JetBrains+Mono:wght@400;500;600&display=swap');

        .admin-page {
          min-height: 100vh;
          background: #09090b;
          color: #f4f4f5;
          padding: 34px;
          font-family: 'Plus Jakarta Sans', sans-serif;
          box-sizing: border-box;
        }

        .admin-page * { box-sizing: border-box; }

        .admin-shell {
          max-width: 1450px;
          margin: 0 auto;
        }

        .admin-topbar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 20px;
          margin-bottom: 38px;
          flex-wrap: wrap;
        }

        .admin-brand {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .admin-brand-icon {
          width: 44px;
          height: 44px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #dc2626;
          box-shadow: 0 0 30px #dc262633;
          font-size: 22px;
          font-weight: 800;
        }

        .admin-brand-name {
          font-size: 15px;
          font-weight: 800;
          letter-spacing: -.4px;
        }

        .admin-brand-caption {
          color: #71717a;
          font-size: 11px;
          margin-top: 4px;
        }

        .admin-top-actions {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }

        .admin-live {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #27272a;
          padding: 10px 13px;
          border-radius: 10px;
          font-size: 11px;
          color: #a1a1aa;
        }

        .admin-live-dot {
          height: 7px;
          width: 7px;
          border-radius: 50%;
          background: #4ade80;
        }

        .admin-btn {
          border: 1px solid #3f3f46;
          background: #18181b;
          color: #e4e4e7;
          border-radius: 10px;
          padding: 11px 15px;
          font-family: inherit;
          font-size: 12px;
          font-weight: 700;
          cursor: pointer;
          transition: .2s;
        }

        .admin-btn:hover {
          border-color: #71717a;
          background: #27272a;
        }

        .admin-btn:disabled {
          opacity: .55;
          cursor: not-allowed;
        }

        .admin-btn-primary {
          background: #dc2626;
          border-color: #dc2626;
          color: white;
        }

        .admin-btn-primary:hover {
          background: #b91c1c;
          border-color: #b91c1c;
        }

        .admin-eyebrow {
          color: #ef4444;
          text-transform: uppercase;
          letter-spacing: 2px;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
          font-weight: 600;
          margin-bottom: 12px;
        }

        .admin-heading {
          font-size: clamp(28px, 4vw, 43px);
          letter-spacing: -2px;
          line-height: 1.15;
          margin: 0;
          font-weight: 800;
        }

        .admin-heading span { color: #ef4444; }

        .admin-subtitle {
          color: #a1a1aa;
          font-size: 13px;
          line-height: 1.8;
          margin-top: 12px;
          max-width: 650px;
        }

        .admin-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 24px;
          flex-wrap: wrap;
          margin-bottom: 30px;
        }

        .admin-stats {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 16px;
          margin-bottom: 28px;
        }

        .admin-stat {
          border: 1px solid #27272a;
          background: linear-gradient(145deg, #141416, #0d0d0f);
          border-radius: 16px;
          padding: 23px;
          position: relative;
          overflow: hidden;
        }

        .admin-stat:after {
          content: '';
          position: absolute;
          width: 85px;
          height: 85px;
          right: -35px;
          top: -35px;
          background: #dc262612;
          border-radius: 50%;
        }

        .admin-stat-label {
          font-size: 11px;
          color: #a1a1aa;
          font-weight: 600;
        }

        .admin-stat-value {
          font-size: 34px;
          font-weight: 800;
          letter-spacing: -1.5px;
          margin: 15px 0 7px;
        }

        .admin-stat-note {
          font-size: 11px;
          color: #71717a;
        }

        .admin-toolbar {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 17px;
          background: #111113;
          border: 1px solid #27272a;
          border-bottom: none;
          border-radius: 15px 15px 0 0;
          flex-wrap: wrap;
        }

        .admin-search {
          position: relative;
          flex: 1;
          min-width: 220px;
        }

        .admin-search-icon {
          position: absolute;
          left: 14px;
          top: 50%;
          transform: translateY(-50%);
          color: #71717a;
          font-size: 17px;
          pointer-events: none;
        }

        .admin-input, .admin-select {
          width: 100%;
          min-width: 0;
          padding: 12px 13px;
          border: 1px solid #303036;
          border-radius: 9px;
          background: #09090b;
          color: #f4f4f5;
          outline: none;
          font-family: inherit;
          font-size: 12px;
          transition: border-color .2s;
        }

        .admin-search .admin-input { padding-left: 40px; }

        .admin-input:focus, .admin-select:focus {
          border-color: #dc2626;
        }

        .admin-select { width: auto; min-width: 145px; }

        .admin-table-wrap {
          overflow-x: auto;
          border: 1px solid #27272a;
          border-radius: 0 0 15px 15px;
          background: #0e0e10;
        }

        .admin-table {
          width: 100%;
          min-width: 790px;
          border-collapse: collapse;
          text-align: left;
        }

        .admin-table th {
          padding: 15px 20px;
          color: #71717a;
          font-size: 10px;
          text-transform: uppercase;
          letter-spacing: 1px;
          font-weight: 700;
          background: #111113;
          border-bottom: 1px solid #27272a;
        }

        .admin-table td {
          padding: 17px 20px;
          border-bottom: 1px solid #202023;
          font-size: 12px;
          vertical-align: middle;
        }

        .admin-table tbody tr:last-child td { border-bottom: none; }
        .admin-table tbody tr:hover { background: #151517; }

        .admin-user {
          display: flex;
          align-items: center;
          gap: 12px;
          min-width: 190px;
        }

        .admin-avatar {
          width: 39px;
          height: 39px;
          flex-shrink: 0;
          border-radius: 12px;
          display: grid;
          place-items: center;
          background: #7f1d1d55;
          color: #fca5a5;
          border: 1px solid #7f1d1d88;
          font-weight: 800;
          font-size: 12px;
        }

        .admin-username {
          font-weight: 700;
          color: #f4f4f5;
          overflow-wrap: anywhere;
        }

        .admin-email {
          font-size: 11px;
          color: #a1a1aa;
          margin-top: 5px;
          overflow-wrap: anywhere;
        }

        .admin-id {
          color: #71717a;
          font-family: 'JetBrains Mono', monospace;
          font-size: 10px;
        }

        .admin-role {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 9px;
          border-radius: 7px;
          text-transform: capitalize;
          font-size: 10px;
          font-weight: 800;
          background: #27272a;
          color: #d4d4d8;
        }

        .admin-role-admin {
          background: #7f1d1d44;
          color: #fca5a5;
          border: 1px solid #7f1d1d66;
        }

        .admin-actions {
          display: flex;
          gap: 8px;
          align-items: center;
        }

        .admin-icon-btn {
          width: 34px;
          height: 34px;
          display: grid;
          place-items: center;
          border: 1px solid #303036;
          background: #18181b;
          color: #d4d4d8;
          border-radius: 9px;
          cursor: pointer;
          font-size: 15px;
        }

        .admin-icon-btn:hover {
          border-color: #dc2626;
          color: #fca5a5;
        }

        .admin-icon-btn.delete:hover {
          background: #7f1d1d33;
          border-color: #991b1b;
          color: #f87171;
        }

        .admin-empty {
          text-align: center;
          padding: 60px 20px;
          color: #a1a1aa;
        }

        .admin-empty-icon {
          font-size: 35px;
          margin-bottom: 15px;
        }

        .admin-footer {
          display: flex;
          justify-content: space-between;
          gap: 12px;
          flex-wrap: wrap;
          padding: 17px 4px;
          color: #71717a;
          font-size: 11px;
        }

        .admin-toast {
          position: fixed;
          z-index: 100;
          right: 24px;
          bottom: 24px;
          max-width: calc(100vw - 32px);
          padding: 15px 18px;
          background: #18181b;
          border: 1px solid #3f3f46;
          border-radius: 12px;
          box-shadow: 0 15px 50px #0008;
          color: #f4f4f5;
          font-size: 12px;
          line-height: 1.6;
        }

        .admin-toast.error { border-color: #991b1b; }
        .admin-toast.success { border-color: #166534; }

        .admin-overlay {
          position: fixed;
          inset: 0;
          z-index: 50;
          display: grid;
          place-items: center;
          padding: 20px;
          background: #000b;
          backdrop-filter: blur(8px);
        }

        .admin-modal {
          width: 100%;
          max-width: 480px;
          max-height: 90vh;
          overflow-y: auto;
          background: #111113;
          border: 1px solid #303036;
          border-radius: 18px;
          padding: 25px;
          box-shadow: 0 25px 100px #0009;
        }

        .admin-modal-heading {
          font-size: 21px;
          font-weight: 800;
          letter-spacing: -.6px;
          margin: 0;
        }

        .admin-modal-subtitle {
          color: #a1a1aa;
          font-size: 12px;
          line-height: 1.7;
          margin: 9px 0 24px;
        }

        .admin-field { margin-bottom: 17px; }

        .admin-field label {
          display: block;
          color: #d4d4d8;
          font-size: 11px;
          font-weight: 700;
          margin-bottom: 8px;
        }

        .admin-field .admin-select { width: 100%; }

        .admin-modal-actions {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          flex-wrap: wrap;
          margin-top: 25px;
        }

        .admin-danger-icon {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          background: #7f1d1d44;
          color: #f87171;
          font-size: 22px;
          margin-bottom: 20px;
        }

        .admin-loading {
          text-align: center;
          padding: 70px 15px;
          color: #a1a1aa;
          font-size: 13px;
        }

        .admin-spinner {
          width: 28px;
          height: 28px;
          margin: 0 auto 15px;
          border: 2px solid #3f3f46;
          border-top-color: #ef4444;
          border-radius: 50%;
          animation: adminSpin .7s linear infinite;
        }

        @keyframes adminSpin {
          to { transform: rotate(360deg); }
        }

        @media (max-width: 760px) {
          .admin-page { padding: 20px 14px; }
          .admin-topbar { margin-bottom: 28px; }
          .admin-heading { letter-spacing: -1.2px; }
          .admin-stats { grid-template-columns: 1fr; gap: 10px; }
          .admin-stat { padding: 17px; }
          .admin-stat-value { font-size: 28px; margin: 10px 0 5px; }
          .admin-toolbar { padding: 12px; }
          .admin-search { flex-basis: 100%; }
          .admin-select { flex: 1; }
          .admin-modal { padding: 20px; }
        }

        @media (prefers-reduced-motion: reduce) {
          .admin-spinner { animation: none; }
          .admin-page * { transition: none !important; }
        }
      `}</style>

      <div className="admin-shell">
        <header className="admin-topbar">
          <div className="admin-brand">
            <div className="admin-brand-icon">A</div>
            <div>
              <div className="admin-brand-name">ADMIN<span style={{ color: "#ef4444" }}>.</span>CONTROL</div>
              <div className="admin-brand-caption">Job Prep & Analyzer</div>
            </div>
          </div>

          <div className="admin-top-actions">
            <div className="admin-live">
              <span className="admin-live-dot" />
              Admin management
            </div>

            <button
              className="admin-btn"
              onClick={() => navigate("/")}
              type="button"
            >
              ← Dashboard
            </button>

            <button
              className="admin-btn admin-btn-primary"
              onClick={loadUsers}
              disabled={loading}
              type="button"
            >
              ↻ Refresh
            </button>
          </div>
        </header>

        <section className="admin-heading-row">
          <div>
            <div className="admin-eyebrow">Administration / Users</div>
            <h1 className="admin-heading">
              User <span>Management.</span>
            </h1>
            <p className="admin-subtitle">
              Manage registered accounts, maintain access roles, and keep
              your platform organized from one place.
            </p>
          </div>

          <div className="admin-live">
            <span className="admin-live-dot" />
            {loading ? "Syncing users..." : "User directory"}
          </div>
        </section>

        <section className="admin-stats">
          <div className="admin-stat">
            <div className="admin-stat-label">TOTAL REGISTERED USERS</div>
            <div className="admin-stat-value">{users.length}</div>
            <div className="admin-stat-note">All registered accounts</div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-label">ADMINISTRATORS</div>
            <div className="admin-stat-value" style={{ color: "#f87171" }}>
              {adminCount}
            </div>
            <div className="admin-stat-note">Accounts with admin privileges</div>
          </div>

          <div className="admin-stat">
            <div className="admin-stat-label">STANDARD USERS</div>
            <div className="admin-stat-value" style={{ color: "#a1a1aa" }}>
              {regularCount}
            </div>
            <div className="admin-stat-note">Regular platform accounts</div>
          </div>
        </section>

        <section>
          <div className="admin-toolbar">
            <div className="admin-search">
              <span className="admin-search-icon">⌕</span>
              <input
                className="admin-input"
                type="search"
                placeholder="Search by username, email or user ID..."
                value={search}
                onChange={(event) => setSearch(event.target.value)}
                aria-label="Search users"
              />
            </div>

            <select
              className="admin-select"
              value={roleFilter}
              onChange={(event) => setRoleFilter(event.target.value)}
              aria-label="Filter by role"
            >
              <option value="all">All roles</option>
              <option value="admin">Administrators</option>
              <option value="user">Standard users</option>
            </select>

            <button
              className="admin-btn"
              onClick={() => {
                setSearch("");
                setRoleFilter("all");
              }}
              type="button"
            >
              Clear filters
            </button>
          </div>

          <div className="admin-table-wrap">
            {loading ? (
              <div className="admin-loading">
                <div className="admin-spinner" />
                Loading registered users...
              </div>
            ) : filteredUsers.length === 0 ? (
              <div className="admin-empty">
                <div className="admin-empty-icon">⌕</div>
                <div style={{ color: "#f4f4f5", fontWeight: 700 }}>
                  No users found
                </div>
                <p style={{ fontSize: 12 }}>
                  Try a different search term or clear your filters.
                </p>
                <button
                  className="admin-btn"
                  onClick={() => {
                    setSearch("");
                    setRoleFilter("all");
                  }}
                  type="button"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>User ID</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user._id}>
                      <td>
                        <div className="admin-user">
                          <div className="admin-avatar">
                            {getInitials(user.username)}
                          </div>
                          <div>
                            <div className="admin-username">
                              {user.username}
                            </div>
                            <div className="admin-email">{user.email}</div>
                          </div>
                        </div>
                      </td>

                      <td>
                        <span className="admin-id">
                          {String(user._id).slice(-8)}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`admin-role ${
                            user.role === "admin" ? "admin-role-admin" : ""
                          }`}
                        >
                          <span>●</span>
                          {user.role || "user"}
                        </span>
                      </td>

                      <td style={{ color: "#a1a1aa", whiteSpace: "nowrap" }}>
                        {formatDate(user.createdAt)}
                      </td>

                      <td>
                        <div className="admin-actions">
                          <button
                            className="admin-icon-btn"
                            title={`Edit ${user.username}`}
                            aria-label={`Edit ${user.username}`}
                            onClick={() => openEdit(user)}
                            type="button"
                          >
                            ✎
                          </button>

                          <button
                            className="admin-icon-btn delete"
                            title={`Delete ${user.username}`}
                            aria-label={`Delete ${user.username}`}
                            onClick={() => setConfirmUser(user)}
                            disabled={deletingId === user._id}
                            type="button"
                          >
                            {deletingId === user._id ? "…" : "⌫"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          <div className="admin-footer">
            <span>
              Showing {filteredUsers.length} of {users.length} users
            </span>
            <span>Secure administrator workspace</span>
          </div>
        </section>
      </div>

      {notice && (
        <div
          className={`admin-toast ${notice.type}`}
          role="status"
        >
          {notice.type === "error" ? "⚠ " : "✓ "}
          {notice.message}
          <button
            type="button"
            onClick={() => setNotice(null)}
            aria-label="Dismiss notification"
            style={{
              marginLeft: 14,
              border: 0,
              background: "transparent",
              color: "#a1a1aa",
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
      )}

      {editingUser && (
        <div
          className="admin-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) closeEdit();
          }}
        >
          <div
            className="admin-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="edit-user-title"
          >
            <div className="admin-eyebrow">Account settings</div>
            <h2 className="admin-modal-heading" id="edit-user-title">
              Edit user
            </h2>
            <p className="admin-modal-subtitle">
              Update account information and access privileges.
            </p>

            <form onSubmit={handleUpdate}>
              <div className="admin-field">
                <label htmlFor="edit-username">Username</label>
                <input
                  id="edit-username"
                  className="admin-input"
                  value={form.username}
                  onChange={(event) =>
                    setForm({ ...form, username: event.target.value })
                  }
                  required
                  maxLength={50}
                  autoComplete="off"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="edit-email">Email address</label>
                <input
                  id="edit-email"
                  className="admin-input"
                  type="email"
                  value={form.email}
                  onChange={(event) =>
                    setForm({ ...form, email: event.target.value })
                  }
                  required
                  autoComplete="off"
                />
              </div>

              <div className="admin-field">
                <label htmlFor="edit-role">Account role</label>
                <select
                  id="edit-role"
                  className="admin-select"
                  value={form.role}
                  onChange={(event) =>
                    setForm({ ...form, role: event.target.value })
                  }
                >
                  <option value="user">Standard user</option>
                  <option value="admin">Administrator</option>
                </select>
              </div>

              <div className="admin-modal-actions">
                <button
                  type="button"
                  className="admin-btn"
                  onClick={closeEdit}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="admin-btn admin-btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : "Save changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {confirmUser && (
        <div
          className="admin-overlay"
          onMouseDown={(event) => {
            if (
              event.target === event.currentTarget &&
              !deletingId
            ) {
              setConfirmUser(null);
            }
          }}
        >
          <div
            className="admin-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="delete-user-title"
          >
            <div className="admin-danger-icon">!</div>
            <h2 className="admin-modal-heading" id="delete-user-title">
              Delete this user?
            </h2>
            <p className="admin-modal-subtitle">
              You are about to delete{" "}
              <strong style={{ color: "#f4f4f5" }}>
                {confirmUser.username}
              </strong>{" "}
              ({confirmUser.email}). This action cannot be undone.
            </p>

            <div className="admin-modal-actions">
              <button
                className="admin-btn"
                type="button"
                disabled={Boolean(deletingId)}
                onClick={() => setConfirmUser(null)}
              >
                Cancel
              </button>

              <button
                className="admin-btn admin-btn-primary"
                type="button"
                disabled={Boolean(deletingId)}
                onClick={handleDelete}
              >
                {deletingId ? "Deleting..." : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
