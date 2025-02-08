export type Note = {
  id: string;
  content: string;
  created_at: string;
  ip_address?: string;
  device_id?: string;
};

export type CreateNoteRequest = {
  content: string;
};

export type ApiResponse<T> = {
  data?: T;
  error?: string;
};

export type GetNotesResponse = ApiResponse<{
  notes: Pick<Note, 'id' | 'content' | 'created_at'>[];
}>;

export type CreateNoteResponse = ApiResponse<{
  note: Pick<Note, 'id' | 'content' | 'created_at'>;
}>;