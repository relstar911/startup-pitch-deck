import { v4 as uuidv4 } from 'uuid';

export interface Slide {
  title: string;
  content: string[];
  imagePrompt: string;
  imageUrl?: string;
}

export interface FormData {
  companyName: string;
  startupIdea: string;
  problemStatement: string;
  solution: string;
  marketDescription: string;
  marketSize: string;
  targetCustomer: string;
  competitors: string;
  uniqueSellingProposition: string;
  revenueModel: string;
  marketingStrategy: string;
  teamMembers: string;
  fundingNeeds: string;
}

export interface PitchDeck {
  id: string;
  companyName: string;
  createdAt: string;
  slides: Slide[];
  formData: FormData;
}

export function savePitchDeck(companyName: string, slides: Slide[], formData: FormData): string {
  try {
    const newDeck: PitchDeck = {
      id: uuidv4(),
      companyName,
      createdAt: new Date().toISOString(),
      slides,
      formData
    };

    const existingDecks = JSON.parse(localStorage.getItem('pitchDecks') || '[]') as PitchDeck[];
    existingDecks.push(newDeck);
    localStorage.setItem('pitchDecks', JSON.stringify(existingDecks));

    return newDeck.id;
  } catch (error) {
    console.error('Error saving pitch deck:', error);
    throw new Error('Failed to save pitch deck');
  }
}

export function getPitchDeck(id: string): PitchDeck | null {
  try {
    const decks = JSON.parse(localStorage.getItem('pitchDecks') || '[]') as PitchDeck[];
    return decks.find((deck: PitchDeck) => deck.id === id) || null;
  } catch (error) {
    console.error('Error retrieving pitch deck:', error);
    return null;
  }
}

export function getAllPitchDecks(): PitchDeck[] {
  try {
    return JSON.parse(localStorage.getItem('pitchDecks') || '[]') as PitchDeck[];
  } catch (error) {
    console.error('Error retrieving all pitch decks:', error);
    throw new Error('Failed to retrieve pitch decks');
  }
}

export function deletePitchDeck(id: string): void {
  try {
    const decks = JSON.parse(localStorage.getItem('pitchDecks') || '[]') as PitchDeck[];
    const updatedDecks = decks.filter((deck: PitchDeck) => deck.id !== id);
    localStorage.setItem('pitchDecks', JSON.stringify(updatedDecks));
  } catch (error) {
    console.error('Error deleting pitch deck:', error);
    throw new Error('Failed to delete pitch deck');
  }
}
