
import React, { useEffect, useState, useContext, useMemo } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../components/PostCard/PostCard";
import { AuthContext } from "../context/AuthContext";
import "./Author.css";

const getAuthorName = (post) => {
  if (!post || !post.author) return "Unknown";
  if (typeof post.author === "string") return post.author;
  return post.author.name || post.author.username || post.author.email || "Unknown";
};

const getAuthorId = (post) => {
  if (!post || !post.author) return null;
  if (typeof post.author === "string") return post.author;
  return post.author._id || post.author.id || null;
};

const getAuthorAvatar = (post) => {
  if (!post || !post.author) return null;
  if (typeof post.author === 'string') return null;
  return post.author.avatar || null;
};

const Author = () => {
  const { user, login } = useContext(AuthContext);
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const idParam = params.get("id");
  const nameParam = params.get("name");

  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState("Author");
  const [rawPosts, setRawPosts] = useState(null);

  // UI state for filtering, sorting, pagination and small UX bits
  const [query, setQuery] = useState("");
  const [sortKey, setSortKey] = useState("newest"); // newest, oldest, title-asc
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(6);
  const [copied, setCopied] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ name: '', bio: '', avatar: '' });

  // small author meta/tagline
  const tagline = (user && (user.bio || user.tagline)) || (nameParam ? "Author & storyteller" : "Writer");

  useEffect(() => {
    const API = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5000";

    const load = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/api/posts`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Failed to fetch posts");

  const allPosts = Array.isArray(data) ? data : data.posts || [];
  // keep a raw copy for debug purposes
  setRawPosts(allPosts);

        // Determine target author identifier: prefer idParam, then nameParam, then logged-in user
        let filtered = allPosts;
        if (idParam) {
          filtered = allPosts.filter((p) => {
            const aid = getAuthorId(p);
            return aid && aid.toString() === idParam.toString();
          });
        } else if (nameParam) {
          filtered = allPosts.filter((p) => {
            const aName = getAuthorName(p) || "";
            return aName.toLowerCase() === nameParam.toLowerCase();
          });
        } else if (user) {
          // try to match by user id or name from AuthContext
          // make matching more permissive to catch different id/name shapes
          const uidCandidates = [user._id, user.id, user._id?.toString(), user.id?.toString()].filter(Boolean).map(String);
          const unameCandidates = [user.name, user.username, user.email].filter(Boolean).map((s) => s.toLowerCase());
          filtered = allPosts.filter((p) => {
            const aid = getAuthorId(p);
            const aName = (getAuthorName(p) || "").toLowerCase();

            // match id in multiple shapes
            if (aid && uidCandidates.length > 0) {
              try {
                if (uidCandidates.includes(aid.toString())) return true;
              } catch (e) {}
            }

            // match by name/email
            if (unameCandidates.includes(aName)) return true;

            // sometimes author stored directly as string (name or id)
            if (typeof p.author === "string") {
              const authStr = p.author.toLowerCase();
              if (unameCandidates.includes(authStr)) return true;
              if (uidCandidates.includes(p.author)) return true;
            }

            return false;
          });
        } else if (nameParam == null && idParam == null) {
          // nothing specified -> no filter (or show message)
          filtered = [];
        }

  setPosts(filtered.slice().reverse());

        // set author display name
        if (idParam || nameParam) {
          if (nameParam) setAuthorName(nameParam);
          else if (filtered[0]) setAuthorName(getAuthorName(filtered[0]));
          else setAuthorName(nameParam || "Author");
        } else if (user) {
          setAuthorName(user.name || user.username || "You");
        } else {
          setAuthorName("Author");
        }
      } catch (e) {
        console.error("Author page fetch error:", e);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [idParam, nameParam, user]);

  // derived filtered + sorted posts based on toolbar state
  const filteredSortedPosts = useMemo(() => {
    const q = (query || "").trim().toLowerCase();
    let list = Array.isArray(posts) ? posts.slice() : [];

    if (q) {
      list = list.filter((p) => {
        const hay = ((p.title || "") + " " + (p.content || p.description || "")).toLowerCase();
        return hay.includes(q);
      });
    }

    if (sortKey === "newest") {
      list.sort((a, b) => {
        const ta = new Date(a.createdAt || a.updatedAt || Date.now()).getTime();
        const tb = new Date(b.createdAt || b.updatedAt || Date.now()).getTime();
        return tb - ta;
      });
    } else if (sortKey === "oldest") {
      list.sort((a, b) => {
        const ta = new Date(a.createdAt || a.updatedAt || Date.now()).getTime();
        const tb = new Date(b.createdAt || b.updatedAt || Date.now()).getTime();
        return ta - tb;
      });
    } else if (sortKey === "title-asc") {
      list.sort((a, b) => (a.title || "").localeCompare(b.title || ""));
    }

    return list;
  }, [posts, query, sortKey]);

  const total = filteredSortedPosts.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  // clamp page when list changes
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages]);

  const currentPage = Math.min(Math.max(1, page), totalPages);
  const start = (currentPage - 1) * pageSize;
  const pagePosts = filteredSortedPosts.slice(start, start + pageSize);

  // determine ownership of this profile early to avoid UI flashing on load
  const uid = user && (user._id || user.id);
  let isOwnerProfile = false;
  // If an explicit idParam is present, compare it with current user id
  if (uid && idParam) {
    try { isOwnerProfile = uid.toString() === idParam.toString(); } catch (e) { isOwnerProfile = false; }
  } else if (uid && nameParam) {
    // if nameParam provided, compare with known user name (case-insensitive)
    const uname = (user && (user.name || user.username || '') || '').toLowerCase();
    try { isOwnerProfile = uname && uname === nameParam.toLowerCase(); } catch (e) { isOwnerProfile = false; }
  } else if (uid && !idParam && !nameParam) {
    // no params and logged-in -> treat as viewing own profile
    isOwnerProfile = true;
  } else if (posts && posts[0] && uid) {
    // fallback: derive from first post's author id when available
    const aid = getAuthorId(posts[0]);
    try { isOwnerProfile = aid && uid && uid.toString() === aid.toString(); } catch (e) { isOwnerProfile = false; }
  }

  // choose avatar: prefer explicit user avatar when owner, otherwise try author's avatar from posts
  const authorAvatar = (isOwnerProfile && user && user.avatar) || (posts && posts[0] && getAuthorAvatar(posts[0])) || (user && user.avatar) || null;

  return (
    <div className="author-page">
      <section className="author-hero minimal">
        <div className="author-hero__content">
          {authorAvatar ? (
            <div className="avatar avatar--ring" aria-label={`Avatar for ${authorName}`}>
              <img src={authorAvatar} alt={`${authorName} avatar`} />
            </div>
          ) : (
            <div className="avatar avatar--ring" aria-label={`Avatar for ${authorName}`}>
              {(authorName || "A").charAt(0).toUpperCase()}
            </div>
          )}
          <div className="hero-text">
            <div className="name-row">
              <h1 className="profile-name">{authorName}</h1>
              {isOwnerProfile && (
                <button
                  className="inline-edit-btn"
                  onClick={() => {
                    setEditingProfile(true);
                    setProfileForm({ name: user.name || '', bio: user.bio || '', avatar: user.avatar || '' });
                  }}
                >
                  Edit
                </button>
              )}
            </div>
            <p className="profile-tagline">{tagline}</p>
            <div className="profile-stats">
              <div className="stat">
                <strong>{loading ? "—" : posts.length}</strong>
                <span>Posts</span>
              </div>
              <div className="stat">
                <strong>{loading ? "—" : (() => {
                  // estimate total reading time across posts in minutes
                  try {
                    const totalWords = posts.reduce((acc, p) => {
                      const text = (p.content || p.description || "") + " " + (p.title || "");
                      return acc + (text ? text.split(/\s+/).filter(Boolean).length : 0);
                    }, 0);
                    const minutes = Math.max(1, Math.ceil(totalWords / 200));
                    return `${minutes}m`;
                  } catch (e) {
                    return "—";
                  }
                })()}</strong>
                <span>Read</span>
              </div>
              <div className="stat">
                <button
                  className={`copy-btn ${copied ? "copied" : ""}`}
                  onClick={async () => {
                    try {
                      await navigator.clipboard.writeText(window.location.href);
                      setCopied(true);
                      setTimeout(() => setCopied(false), 2000);
                    } catch (e) {
                      // fallback: try older API
                      try {
                        const txt = window.location.href;
                        const ta = document.createElement('textarea');
                        ta.value = txt;
                        document.body.appendChild(ta);
                        ta.select();
                        document.execCommand('copy');
                        document.body.removeChild(ta);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      } catch (err) {
                        console.error('Copy failed', err);
                      }
                    }
                  }}
                  aria-label="Copy author profile link"
                >
                  {copied ? "Link copied" : "Copy profile link"}
                </button>
                {/* owner edit button moved next to name to avoid layout shift */}
              </div>
            </div>
          </div>
        </div>
      </section>

      {editingProfile && (
        <section className="author-edit card flat" aria-label="Edit profile">
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const token = localStorage.getItem('token');
              if (!token) return alert('Login required');
              try {
                const API = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
                const res = await fetch(`${API}/api/auth/profile`, {
                  method: 'PUT',
                  headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                  body: JSON.stringify(profileForm),
                });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Failed to update profile');
                // update local user in context and localStorage (keep token)
                const tokenValue = localStorage.getItem('token');
                const updated = { ...user, ...data, token: tokenValue };
                login(updated);
                setEditingProfile(false);
              } catch (err) {
                console.error('Update profile failed', err);
                alert(err.message || 'Failed to update profile');
              }
            }}
          >
            <label>Name</label>
            <input value={profileForm.name} onChange={(e) => setProfileForm((p) => ({ ...p, name: e.target.value }))} />

            <label>Bio</label>
            <input value={profileForm.bio} onChange={(e) => setProfileForm((p) => ({ ...p, bio: e.target.value }))} />

            <label>Avatar image (URL or upload)</label>
            <input
              type="text"
              placeholder="Image URL"
              value={profileForm.avatar}
              onChange={(e) => setProfileForm((p) => ({ ...p, avatar: e.target.value }))}
            />
            <input
              type="file"
              accept="image/*"
              onChange={async (e) => {
                const f = e.target.files && e.target.files[0];
                if (!f) return;
                const reader = new FileReader();
                reader.onload = () => setProfileForm((p) => ({ ...p, avatar: reader.result }));
                reader.readAsDataURL(f);
              }}
            />

            <div style={{ marginTop: 8 }}>
              <button type="submit" className="save-profile-btn">Save</button>
              <button type="button" onClick={() => setEditingProfile(false)} style={{ marginLeft: 8 }}>Cancel</button>
            </div>
          </form>
        </section>
      )}

      <section className="author-activity card flat">
        <div className="section-head">
          <h3>Recent posts</h3>
          {!loading && posts?.length > 0 && (
            <span className="count-chip subtle">{posts.length}</span>
          )}
        </div>

        {/* Toolbar: filter, sort, page size */}
        <div className="author-toolbar" role="toolbar" aria-label="Author filters and actions">
          <label htmlFor="author-search" className="sr-only">Search posts</label>
          <input
            id="author-search"
            className="search-input"
            placeholder="Filter by title or description"
            value={query}
            onChange={(e) => { setQuery(e.target.value); setPage(1); }}
            onKeyDown={(e) => { if (e.key === 'Enter') setPage(1); }}
            aria-label="Filter posts"
          />

          <label htmlFor="sort-select" className="sr-only">Sort posts</label>
          <select
            id="sort-select"
            value={sortKey}
            onChange={(e) => { setSortKey(e.target.value); setPage(1); }}
            aria-label="Sort posts"
          >
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="title-asc">Title A–Z</option>
          </select>

          <label htmlFor="page-size" className="sr-only">Page size</label>
          <select
            id="page-size"
            value={pageSize}
            onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
            aria-label="Posts per page"
          >
            <option value={6}>6 / page</option>
            <option value={12}>12 / page</option>
            <option value={24}>24 / page</option>
          </select>
        </div>

        {loading ? (
          <div className="skeleton-grid">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="skeleton-card light" />
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="empty light">
            <div className="avatar avatar--md avatar--ring">{(authorName || "A").charAt(0).toUpperCase()}</div>
            <h4>No posts yet</h4>
            <p>{authorName} hasn’t published anything here.</p>
          </div>
        ) : (
          <>
            <div className="posts-grid">
              {pagePosts.map((post) => {
                const id = post._id || post.id;
                // compute short description + per-post read estimate
                const text = (post.content || post.description || "") + " " + (post.title || "");
                const words = text ? text.split(/\s+/).filter(Boolean).length : 0;
                const minutes = Math.max(1, Math.ceil(words / 200));
                const desc = ((post.content || post.description || "").slice(0, 140)).trim();
                const descWithTime = `${desc} • ${minutes} min read`;

                // determine if current user is the author for edit/delete
                const isOwner = user && (() => {
                  const aid = getAuthorId(post);
                  const uid = user._id || user.id;
                  return uid && aid && uid.toString() === aid.toString();
                })();

                return (
                  <div key={id} className="post-wrapper">
                    <PostCard
                      id={id}
                      title={post.title}
                      author={getAuthorName(post)}
                      image={post.image}
                      description={descWithTime}
                    />

                    {isOwner && (
                      <div className="post-actions">
                        <button
                          className="edit-post-btn"
                          onClick={() => {
                            // navigate to create/edit page with id param
                            window.location.href = `/create-post?id=${id}`;
                          }}
                        >
                          Edit
                        </button>
                        <button
                          className="delete-post-btn"
                          onClick={async () => {
                            if (!confirm('Delete this post? This action cannot be undone.')) return;
                            try {
                              const token = localStorage.getItem('token');
                              if (!token) throw new Error('Not authenticated');
                              const API = import.meta?.env?.VITE_API_BASE_URL || 'http://localhost:5000';
                              const res = await fetch(`${API}/api/posts/${id}`, {
                                method: 'DELETE',
                                headers: { Authorization: `Bearer ${token}` },
                              });
                              const data = await res.json();
                              if (!res.ok) throw new Error(data.message || 'Delete failed');
                              // remove post from UI
                              setPosts((p) => p.filter((x) => (x._id || x.id) !== id));
                            } catch (err) {
                              console.error('Delete failed', err);
                              alert(err.message || 'Failed to delete post');
                            }
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            <div className="pagination" role="navigation" aria-label="Posts pagination">
              <button onClick={() => setPage(1)} disabled={currentPage <= 1} aria-label="First page">«</button>
              <button onClick={() => setPage(prev => Math.max(1, prev - 1))} disabled={currentPage <= 1} aria-label="Previous page">Prev</button>
              <span className="page-indicator">Page {currentPage} / {totalPages}</span>
              <button onClick={() => setPage(prev => Math.min(totalPages, prev + 1))} disabled={currentPage >= totalPages} aria-label="Next page">Next</button>
              <button onClick={() => setPage(totalPages)} disabled={currentPage >= totalPages} aria-label="Last page">»</button>
            </div>
          </>
        )}
      </section>
    </div>
  );
};

export default Author;