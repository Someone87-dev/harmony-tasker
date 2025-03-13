
import React, { useState } from 'react';
import { FileText, Pin, PinOff, Plus, Search, Trash2 } from 'lucide-react';
import DashboardCard from '../ui/DashboardCard';
import useLocalStorage from '@/hooks/useLocalStorage';
import { Note } from '@/types';
import { cn } from '@/lib/utils';

const Notes = () => {
  const [notes, setNotes] = useLocalStorage<Note[]>('focusflow-notes', []);
  const [activeNote, setActiveNote] = useState<Note | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddNote, setShowAddNote] = useState(false);
  const [newNoteTitle, setNewNoteTitle] = useState('');
  const [newNoteContent, setNewNoteContent] = useState('');

  const filteredNotes = notes.filter(note => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddNote = () => {
    if (newNoteTitle.trim() === '') return;
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: newNoteTitle,
      content: newNoteContent,
      lastEdited: new Date(),
      createdAt: new Date(),
      pinned: false,
    };
    
    setNotes([newNote, ...notes]);
    setNewNoteTitle('');
    setNewNoteContent('');
    setShowAddNote(false);
    setActiveNote(newNote);
  };

  const handleUpdateNote = (content: string) => {
    if (!activeNote) return;
    
    const updatedNote = {
      ...activeNote,
      content,
      lastEdited: new Date(),
    };
    
    setNotes(notes.map(note => note.id === activeNote.id ? updatedNote : note));
    setActiveNote(updatedNote);
  };

  const togglePin = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, pinned: !note.pinned } : note
    ));
  };

  const deleteNote = (noteId: string) => {
    setNotes(notes.filter(note => note.id !== noteId));
    if (activeNote?.id === noteId) {
      setActiveNote(null);
    }
  };

  const formattedDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const sortedNotes = [...filteredNotes].sort((a, b) => {
    // First sort by pinned status
    if (a.pinned && !b.pinned) return -1;
    if (!a.pinned && b.pinned) return 1;
    
    // Then sort by last edited date
    return new Date(b.lastEdited).getTime() - new Date(a.lastEdited).getTime();
  });

  return (
    <DashboardCard 
      title="Notes" 
      icon={<FileText />}
      className="col-span-2 row-span-2"
    >
      <div className="flex h-[500px] gap-4">
        <div className="w-1/3 border-r border-border/50 pr-4">
          <div className="mb-3 flex">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <input
                type="text"
                placeholder="Search notes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              />
            </div>
            <button
              onClick={() => setShowAddNote(true)}
              className="ml-2 bg-primary hover:bg-primary/90 text-white p-2 rounded-lg transition-colors duration-200 focus-ring"
              aria-label="Add note"
            >
              <Plus size={20} />
            </button>
          </div>

          <div className="space-y-2 h-[440px] overflow-y-auto pr-2">
            {sortedNotes.length === 0 ? (
              <p className="text-center py-6 text-muted-foreground">
                No notes yet. Create your first note!
              </p>
            ) : (
              sortedNotes.map(note => (
                <div 
                  key={note.id}
                  className={cn(
                    "px-4 py-3 rounded-lg border cursor-pointer group",
                    activeNote?.id === note.id ? "border-primary bg-primary/5" : "border-border bg-white hover:border-primary/50",
                    note.pinned && "border-amber-200 bg-amber-50/50"
                  )}
                  onClick={() => setActiveNote(note)}
                >
                  <div className="flex items-start justify-between">
                    <h3 className="font-medium truncate">{note.title}</h3>
                    <div className="flex gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePin(note.id);
                        }}
                        className="text-amber-500 focus-ring rounded p-1"
                        aria-label={note.pinned ? "Unpin note" : "Pin note"}
                      >
                        {note.pinned ? <PinOff size={14} /> : <Pin size={14} />}
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteNote(note.id);
                        }}
                        className="text-muted-foreground hover:text-destructive focus-ring rounded p-1"
                        aria-label="Delete note"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground truncate">{note.content}</p>
                  <p className="text-xs text-muted-foreground mt-2">
                    {formattedDate(note.lastEdited)}
                  </p>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="w-2/3">
          {showAddNote ? (
            <div className="h-full flex flex-col">
              <input
                type="text"
                placeholder="Note title..."
                value={newNoteTitle}
                onChange={(e) => setNewNoteTitle(e.target.value)}
                className="w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary mb-2"
              />
              <textarea
                placeholder="Write your note here..."
                value={newNoteContent}
                onChange={(e) => setNewNoteContent(e.target.value)}
                className="flex-1 w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary mb-2 resize-none"
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowAddNote(false)}
                  className="px-4 py-2 bg-secondary hover:bg-secondary/80 text-foreground rounded-lg transition-colors duration-200 focus-ring"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddNote}
                  className="px-4 py-2 bg-primary hover:bg-primary/90 text-white rounded-lg transition-colors duration-200 focus-ring"
                >
                  Save
                </button>
              </div>
            </div>
          ) : activeNote ? (
            <div className="h-full flex flex-col">
              <h2 className="text-xl font-medium mb-2">{activeNote.title}</h2>
              <div className="text-sm text-muted-foreground mb-4">
                Last edited: {formattedDate(activeNote.lastEdited)}
              </div>
              <textarea
                value={activeNote.content}
                onChange={(e) => handleUpdateNote(e.target.value)}
                className="flex-1 w-full px-3 py-2 bg-white/50 border border-border rounded-lg focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary resize-none"
              />
            </div>
          ) : (
            <div className="h-full flex items-center justify-center text-muted-foreground">
              <div className="text-center">
                <FileText size={48} className="mx-auto mb-2 text-muted-foreground/50" />
                <p>Select a note or create a new one</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardCard>
  );
};

export default Notes;
