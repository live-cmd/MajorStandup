import './QuoteTicker.css';

export default function QuoteTicker({ quotes = [] }) {
  return (
    <div className="quote-ticker" aria-label="What people are saying">
      <div className="quote-ticker__track">
        {Array(2).fill(null).map((_, dupeIdx) => (
          <div className="quote-ticker__segment" key={dupeIdx}>
            {quotes.map((q, i) => (
              <div className="quote-card" key={i}>
                <div className="quote-card__mark">&ldquo;</div>
                <p className="quote-card__text">{q}</p>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
