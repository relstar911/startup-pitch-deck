import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { getAllPitchDecks, PitchDeck } from '@/lib/localStorage';

export function PitchDeckLog() {
  const [pitchDecks, setPitchDecks] = useState<PitchDeck[]>([]);

  useEffect(() => {
    setPitchDecks(getAllPitchDecks());
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Pitch Deck History</h2>
      {pitchDecks.length === 0 ? (
        <p>No pitch decks available.</p>
      ) : (
        <ul className="space-y-2">
          {pitchDecks.map((deck) => (
            <li key={deck.id} className="flex items-center justify-between">
              <span>{deck.companyName} - {new Date(deck.createdAt).toLocaleDateString()}</span>
              <Link to={`/presentation/${deck.id}`}>
                <Button variant="outline" size="sm">View</Button>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
