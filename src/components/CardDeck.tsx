import { DECK } from '../lib/deck.ts';

/**
 * The planning poker card tray. Voting behaviour is delivered by a separate
 * story, so cards are presentational here — the creator can see the deck.
 */
export function CardDeck() {
  return (
    <section className="panel deck" aria-label="Card deck">
      <h2 className="panel__heading panel__heading--divider">YOUR VOTE</h2>
      <div className="deck__tray" role="list">
        {DECK.map((card) => (
          <div key={card.value} className="card" role="listitem">
            <span className="card__label">{card.label}</span>
            {card.flavour && <span className="card__flavour">{card.flavour}</span>}
          </div>
        ))}
      </div>
    </section>
  );
}
