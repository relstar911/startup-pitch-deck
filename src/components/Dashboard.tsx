import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom'; // Add useNavigate here
import { Button } from "@/components/ui/button";
import { saveAs } from 'file-saver';
import { getAllPitchDecks, deletePitchDeck, PitchDeck } from '@/lib/localStorage';
import { PitchDeckLog } from '@/components/PitchDeckLog'; // Updated import path

export function Dashboard() {
  const [savedDecks, setSavedDecks] = useState<PitchDeck[]>([]);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate(); // Add this line to initialize the navigate function

  useEffect(() => {
    try {
      setSavedDecks(getAllPitchDecks());
    } catch (error) {
      setError('Failed to load saved pitch decks');
      console.error(error);
    }
  }, []);

  const deleteDeck = (id: string) => {
    try {
      deletePitchDeck(id);
      setSavedDecks(getAllPitchDecks());
      setError(null);
    } catch (error) {
      setError('Failed to delete pitch deck');
      console.error(error);
    }
  };

  const exportDeck = (deck: PitchDeck) => {
    try {
      const blob = new Blob([JSON.stringify(deck, null, 2)], {type: "application/json"});
      saveAs(blob, `${deck.companyName}_pitch_deck.json`);
      setError(null);
    } catch (error) {
      setError('Failed to export pitch deck');
      console.error(error);
    }
  };

  return (
    <div className="container mx-auto p-4" role="main">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Pitch Deck Dashboard</h1>
        <Button onClick={() => navigate('/')} variant="outline" aria-label="Navigate back to Generator">
          Back to Generator
        </Button>
      </div>
      {error && <p className="text-red-500 mb-4" role="alert" aria-live="assertive">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <section aria-labelledby="saved-decks-heading">
          <h2 id="saved-decks-heading" className="text-xl font-semibold mb-4">Saved Pitch Decks</h2>
          {savedDecks.length === 0 ? (
            <p>No saved pitch decks yet.</p>
          ) : (
            <ul className="space-y-4" aria-label="List of saved pitch decks">
              {savedDecks.map((deck) => (
                <li key={deck.id} className="border p-4 rounded-lg">
                  <div className="flex items-center">
                    {deck.slides[0]?.imageUrl && (
                      <img src={deck.slides[0].imageUrl} alt={`Thumbnail for ${deck.companyName} pitch deck`} className="w-16 h-16 object-cover rounded-md mr-4" />
                    )}
                    <div>
                      <h3 className="text-lg font-semibold">{deck.companyName}</h3>
                      <p className="text-sm text-gray-500">Created: {new Date(deck.createdAt).toLocaleDateString()}</p>
                    </div>
                  </div>
                  <div className="mt-2 space-x-2">
                    <Link to={`/presentation/${deck.id}`}>
                      <Button variant="outline" size="sm" aria-label={`View ${deck.companyName} pitch deck`}>View</Button>
                    </Link>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      onClick={() => exportDeck(deck)} 
                      aria-label={`Export ${deck.companyName} pitch deck`}
                    >
                      Export
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm" 
                      onClick={() => deleteDeck(deck.id)} 
                      aria-label={`Delete ${deck.companyName} pitch deck`}
                    >
                      Delete
                    </Button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
        <section aria-labelledby="pitch-deck-log-heading">
          <h2 id="pitch-deck-log-heading" className="sr-only">Pitch Deck Log</h2>
          <PitchDeckLog />
        </section>
      </div>
      <Link to="/" className="mt-8 inline-block">
        <Button aria-label="Create a new pitch deck">Create New Pitch Deck</Button>
      </Link>
    </div>
  );
}
