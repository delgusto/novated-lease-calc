'use client';

import { FAQ_ITEMS } from '@/lib/faq-items';

export { FAQ_ITEMS };

export function FaqSection() {
  return (
    <section className="nl-faq" id="faq">
      <div className="nl-faq-inner">
        <span className="nl-eyebrow">Common questions</span>
        <h2>FAQ</h2>
        <div className="nl-faq-list">
          {FAQ_ITEMS.map((item) => (
            <details key={item.q} className="nl-faq-item">
              <summary>
                {item.q}
                <span className="nl-faq-plus" aria-hidden="true">+</span>
              </summary>
              <div className="nl-faq-ans">{item.a}</div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
