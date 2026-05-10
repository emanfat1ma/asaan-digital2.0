import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { tutorialAPI } from '../services/api';
import './CategoryExplore.css';
import NetworkWeb from './NetworkWeb';

const CATEGORY_META = {
  whatsapp:    { label: 'WhatsApp',            subtitle: 'Messaging',        color: 'basics' },
  payments:    { label: 'Digital Payments',    subtitle: 'Finance',          color: 'payments' },
  gov:         { label: 'Government Services', subtitle: 'Public Portals',   color: 'gov' },
  social:      { label: 'Social Media',        subtitle: 'Stay Connected',   color: 'smart' },
  phone:       { label: 'Phone Basics',        subtitle: 'Beginner Journey', color: 'basics' },
  email:       { label: 'Email & Internet',    subtitle: 'Go Online',        color: 'learning' },
  safety:      { label: 'Online Safety',       subtitle: 'Stay Safe',        color: 'gov' },
  jobs:        { label: 'Job Applications',    subtitle: 'Career',           color: 'smart' },
};

const DIFFICULTY = {
  1: { label: 'Very Easy', color: '#28a745' },
  2: { label: 'Easy',      color: '#20c997' },
  3: { label: 'Medium',    color: '#ffc107' },
  4: { label: 'Hard',      color: '#fd7e14' },
  5: { label: 'Advanced',  color: '#dc3545' },
};

const CategoryExplore = () => {
  const { category: categoryKey } = useParams();
  const meta = CATEGORY_META[categoryKey] || CATEGORY_META.whatsapp;

  const [tutorials, setTutorials] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const tutRes = await tutorialAPI.getTutorials({ limit: 100 });
        setTutorials(tutRes.data?.tutorials || tutRes.data || []);
      } catch (err) {
        console.error('Failed to fetch data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Match the URL param to the real DB category id
  const filtered = tutorials.filter(t =>
    t.category_name?.toLowerCase() === meta.label?.toLowerCase()
  );

  return (
    <>
      {/* ── Header with category-specific class and NetworkWeb ── */}
      <div className={`ce-header ${categoryKey}`}>
        <div className="ce-header-hatch" />
        <div className="container-xl">
          <div className="ce-header-body">
            <div className={`ce-icon-block ce-icon-block--${meta.color}`}>
              <i className="fas fa-folder-open"></i>
            </div>
            <div>
              <p className="ce-cat-sub">{meta.subtitle}</p>
              <h1 className="ce-cat-title">{meta.label}</h1>
              <p className="ce-cat-count">
                {loading ? '—' : filtered.length}&nbsp;
                tutorial{filtered.length !== 1 ? 's' : ''} available
              </p>
            </div>
          </div>

          {/* Category switcher pills - No emojis */}
          <div className="ce-pills">
            {Object.entries(CATEGORY_META).map(([key, m]) => (
              <Link
                key={key}
                to={`/seekhna/${key}`}
                className={`ce-pill ${key === categoryKey ? 'active' : ''}`}
              >
                {m.label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ── Grid with blue background ── */}
      <div className="ce-grid-wrap">
        <div className="container-xl">
          {loading ? (
            <div className="ce-loading">
              <div className="ce-spinner" />
              <p>Loading tutorials…</p>
            </div>
          ) : filtered.length === 0 ? (
            <div className="ce-empty">
              <span className="ce-empty-icon">🔍</span>
              <h3>No tutorials in this category yet</h3>
              <Link to="/seekhna" className="ce-empty-link">Browse all tutorials</Link>
            </div>
          ) : (
            <div className="ce-grid">
              {filtered.map((t, i) => {
                const diff = DIFFICULTY[t.difficulty_level] || DIFFICULTY[2];
                return (
                  <Link
                    to={`/tutorial/${t.id}`}
                    key={t.id}
                    className="ce-card"
                    style={{ animationDelay: `${i * 55}ms` }}
                  >
                    {/* top colour stripe = difficulty */}
                    <div className="ce-stripe" style={{ background: diff.color }} />

                    <div className="ce-card-body">
                      <span className="ce-badge">{t.category_name}</span>
                      <h2 className="ce-urdu" dir="rtl">{t.title_urdu}</h2>
                      <p className="ce-english">{t.title_english}</p>
                      <div className="ce-tags">
                        <span className="ce-tag">
                          <i className="fas fa-signal"></i> {diff.label}
                        </span>
                        <span className="ce-tag">
                          <i className="fas fa-clock"></i> {t.estimated_time_minutes || 5} min
                        </span>
                      </div>
                    </div>

                    <div className="ce-card-footer">
                      <div className="start-tutorial-btn">
                        Start Learning <i className="fas fa-arrow-right"></i>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Tip ── */}
      {!loading && filtered.length > 0 && (
        <div className="ce-tip-wrap">
          <div className="container-xl">
            <div className="ce-tip">
              <i className="fas fa-lightbulb ce-tip-icon" />
              <span>
                <strong>Seekhna Tip:</strong> All guides are free and tested on real Pakistani platforms with step-by-step screenshots.
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default CategoryExplore;
