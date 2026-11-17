import { useState } from 'react';

const tabs = [
  { id: 'mission', label: 'Our Mission', p: ['Our mission is to deliver strategic real estate solutions that create long-term value for clients.', 'We support project development, investment planning, and consultancy with expert guidance.'] },
  { id: 'vission', label: 'Our Vission', p: ['Our vision is to become a global leader in real estate advisory and transport logistics support.', 'We aim to innovate and modernize traditional consultancy approaches.'] },
  { id: 'history', label: 'Our History', p: ['With over 25 years of industry experience, we have completed numerous landmark projects.', 'Our journey reflects trust, performance, and long-term partnerships.'] },
];

export default function AboutTabs() {
  const [active, setActive] = useState(tabs[0].id);
  const current = tabs.find((t) => t.id === active);
  return (
    <>
      <ul className="nav nav-tabs" role="tablist">
        {tabs.map((t) => (
          <li key={t.id} className="nav-item" role="presentation">
            <button type="button" role="tab" aria-selected={active === t.id}
              className={`nav-link ${active === t.id ? 'active' : ''}`} onClick={() => setActive(t.id)}>
              {t.label}
            </button>
          </li>
        ))}
      </ul>
      <div className="tab-content">
        <div className="tab-pane fade show active">
          <div className="d-sm-flex gap-4 mb-3">
            <div className="tab-img"><img src="/assets/ab-t1.png" alt="tab" className="rounded-4" /></div>
            <div className="tab-txt">{current.p.map((t) => <p key={t}>{t}</p>)}</div>
          </div>
          <h3 className="display-6">We specialize in delivering strategic guidance, project development support,</h3>
        </div>
      </div>
    </>
  );
}
