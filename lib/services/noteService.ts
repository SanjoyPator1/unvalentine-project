import { CreateNoteRequest, CreateNoteResponse, GetNotesResponse } from '@/types/note';

export const noteService = {
  // Get all notes
  async getNotes(limit: number = 10, offset: number = 0) {
    const response = await fetch(`/api/notes?limit=${limit}&offset=${offset}`);
    const result = (await response.json()) as GetNotesResponse;
    
    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to fetch notes');
    }

    return result.data!;
  },

  // Create a new note
  async createNote(content: string) {
    const response = await fetch('/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content } as CreateNoteRequest),
    });

    const result = await response.json() as CreateNoteResponse;
    
    if (!response.ok || result.error) {
      throw new Error(result.error || 'Failed to create note');
    }
    
    return result.data!;
  },
};