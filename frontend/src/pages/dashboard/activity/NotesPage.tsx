import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search, Plus, Tag, Calendar, Trash2, Archive, Pin, PinOff, Pencil, Save, X } from 'lucide-react';

type Note = {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  isPinned: boolean;
  isArchived: boolean;
  category: 'personal' | 'financial' | 'meeting' | 'other';
};

const mockNotes: Note[] = [
  {
    id: 'note-1',
    title: 'Q4 Investment Strategy',
    content: 'Review tech stocks and consider rebalancing portfolio towards more stable assets. Look into emerging markets for potential growth opportunities.',
    tags: ['investments', 'strategy', 'q4'],
    createdAt: new Date('2023-10-15'),
    updatedAt: new Date('2023-11-05'),
    isPinned: true,
    isArchived: false,
    category: 'financial',
  },
  {
    id: 'note-2',
    title: 'Meeting with Financial Advisor',
    content: 'Discuss tax optimization strategies and review retirement planning. Bring up questions about 401k contribution limits for next year.',
    tags: ['meeting', 'retirement', 'tax'],
    createdAt: new Date('2023-11-01'),
    updatedAt: new Date('2023-11-10'),
    isPinned: true,
    isArchived: false,
    category: 'meeting',
  },
  {
    id: 'note-3',
    title: 'Real Estate Investment Ideas',
    content: 'Research potential rental properties in Austin, TX. Look for properties near the new tech hub with good school districts.',
    tags: ['real-estate', 'research', 'austin'],
    createdAt: new Date('2023-11-05'),
    updatedAt: new Date('2023-11-08'),
    isPinned: false,
    isArchived: false,
    category: 'financial',
  },
  {
    id: 'note-4',
    title: 'Family Vacation Planning',
    content: 'Budget for summer vacation - considering Greece or Portugal. Need to book flights by January for best prices.',
    tags: ['travel', 'budget', 'family'],
    createdAt: new Date('2023-10-20'),
    updatedAt: new Date('2023-11-12'),
    isPinned: false,
    isArchived: false,
    category: 'personal',
  },
  {
    id: 'note-5',
    title: 'Tax Documents Checklist',
    content: 'W2 from employer, 1099-INT from bank, mortgage interest statement, property tax receipts, charitable donations log.',
    tags: ['tax', 'documents', 'checklist'],
    createdAt: new Date('2023-01-05'),
    updatedAt: new Date('2023-01-05'),
    isPinned: false,
    isArchived: true,
    category: 'financial',
  },
];

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date);
};

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>(mockNotes);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [isCreatingNote, setIsCreatingNote] = useState(false);
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [newNote, setNewNote] = useState<Partial<Note>>({
    title: '',
    content: '',
    tags: [],
    category: 'personal',
  });
  const [newTag, setNewTag] = useState('');

  const filteredNotes = notes.filter((note) => {
    const matchesSearch = 
      note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesCategory = 
      activeTab === 'all' || 
      (activeTab === 'pinned' && note.isPinned) ||
      (activeTab === 'archived' && note.isArchived) ||
      note.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });

  const pinnedNotes = filteredNotes.filter(note => note.isPinned && !note.isArchived);
  const activeNotes = filteredNotes.filter(note => !note.isPinned && !note.isArchived);
  const archivedNotes = filteredNotes.filter(note => note.isArchived);

  const handleCreateNote = () => {
    const newNoteObj: Note = {
      id: `note-${Date.now()}`,
      title: newNote.title || 'Untitled Note',
      content: newNote.content || '',
      tags: newNote.tags || [],
      category: newNote.category || 'personal',
      createdAt: new Date(),
      updatedAt: new Date(),
      isPinned: false,
      isArchived: false,
    };

    setNotes([newNoteObj, ...notes]);
    setNewNote({ title: '', content: '', tags: [], category: 'personal' });
    setIsCreatingNote(false);
  };

  const handleUpdateNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { 
        ...note, 
        ...newNote, 
        updatedAt: new Date() 
      } : note
    ));
    setEditingNoteId(null);
    setNewNote({ title: '', content: '', tags: [], category: 'personal' });
  };

  const handleDeleteNote = (id: string) => {
    setNotes(notes.filter(note => note.id !== id));
  };

  const togglePinNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const toggleArchiveNote = (id: string) => {
    setNotes(notes.map(note => 
      note.id === id ? { ...note, isArchived: !note.isArchived } : note
    ));
  };

  const startEditing = (note: Note) => {
    setEditingNoteId(note.id);
    setNewNote({
      title: note.title,
      content: note.content,
      tags: [...note.tags],
      category: note.category,
    });
  };

  const cancelEditing = () => {
    setEditingNoteId(null);
    setNewNote({ title: '', content: '', tags: [], category: 'personal' });
  };

  const addTag = () => {
    if (newTag.trim() && !newNote.tags?.includes(newTag.trim())) {
      setNewNote({
        ...newNote,
        tags: [...(newNote.tags || []), newTag.trim()],
      });
      setNewTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setNewNote({
      ...newNote,
      tags: (newNote.tags || []).filter(tag => tag !== tagToRemove),
    });
  };

  const NoteCard = ({ note }: { note: Note }) => (
    <Card className="relative group hover:shadow-md transition-shadow">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">
            {editingNoteId === note.id ? (
              <Input
                value={newNote.title}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
                className="mb-2"
              />
            ) : (
              note.title
            )}
          </CardTitle>
          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => togglePinNote(note.id)}
              title={note.isPinned ? 'Unpin' : 'Pin to top'}
            >
              {note.isPinned ? <PinOff className="h-4 w-4" /> : <Pin className="h-4 w-4" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => toggleArchiveNote(note.id)}
              title={note.isArchived ? 'Unarchive' : 'Archive'}
            >
              <Archive className="h-4 w-4" />
            </Button>
            {editingNoteId === note.id ? (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => handleUpdateNote(note.id)}
                  title="Save"
                >
                  <Save className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={cancelEditing}
                  title="Cancel"
                >
                  <X className="h-4 w-4" />
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => startEditing(note)}
                  title="Edit"
                >
                  <Pencil className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => handleDeleteNote(note.id)}
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
        </div>
        <div className="flex items-center text-sm text-muted-foreground gap-4">
          <span className="flex items-center">
            <Calendar className="h-4 w-4 mr-1" />
            {formatDate(note.updatedAt)}
          </span>
          <span className="capitalize">{note.category}</span>
        </div>
      </CardHeader>
      <CardContent>
        {editingNoteId === note.id ? (
          <Textarea
            value={newNote.content}
            onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
            className="min-h-[100px] mb-4"
          />
        ) : (
          <p className="whitespace-pre-line">{note.content}</p>
        )}
        
        <div className="mt-4">
          {editingNoteId === note.id ? (
            <div className="mb-2">
              <div className="flex gap-2 mb-2">
                <Input
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && addTag()}
                  placeholder="Add a tag and press Enter"
                  className="h-8"
                />
                <Button size="sm" onClick={addTag}>
                  Add Tag
                </Button>
              </div>
              <div className="flex flex-wrap gap-2">
                {newNote.tags?.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                    <button 
                      type="button" 
                      className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 focus:outline-none"
                      onClick={() => removeTag(tag)}
                    >
                      <span className="sr-only">Remove tag</span>
                      <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                        <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                      </svg>
                    </button>
                  </span>
                ))}
              </div>
              <div className="mt-2">
                <label className="text-sm font-medium leading-none">Category</label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({ ...newNote, category: e.target.value as any })}
                  className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                >
                  <option value="personal">Personal</option>
                  <option value="financial">Financial</option>
                  <option value="meeting">Meeting</option>
                  <option value="other">Other</option>
                </select>
              </div>
            </div>
          ) : (
            note.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {note.tags.map((tag) => (
                  <span 
                    key={tag} 
                    className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )
          )}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground">Keep track of your financial thoughts and ideas</p>
        </div>
        <Button onClick={() => setIsCreatingNote(true)}>
          <Plus className="mr-2 h-4 w-4" /> New Note
        </Button>
      </div>

      {isCreatingNote && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>New Note</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                placeholder="Title"
                value={newNote.title || ''}
                onChange={(e) => setNewNote({ ...newNote, title: e.target.value })}
              />
              <Textarea
                placeholder="Start writing your note here..."
                value={newNote.content || ''}
                onChange={(e) => setNewNote({ ...newNote, content: e.target.value })}
                className="min-h-[150px]"
              />
              <div>
                <div className="flex gap-2 mb-2">
                  <Input
                    value={newTag}
                    onChange={(e) => setNewTag(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && addTag()}
                    placeholder="Add a tag and press Enter"
                    className="h-8"
                  />
                  <Button size="sm" onClick={addTag}>
                    Add Tag
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {newNote.tags?.map((tag) => (
                    <span 
                      key={tag} 
                      className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
                    >
                      {tag}
                      <button 
                        type="button" 
                        className="ml-1.5 inline-flex items-center justify-center h-4 w-4 rounded-full bg-blue-200 text-blue-800 hover:bg-blue-300 focus:outline-none"
                        onClick={() => removeTag(tag)}
                      >
                        <span className="sr-only">Remove tag</span>
                        <svg className="h-2 w-2" stroke="currentColor" fill="none" viewBox="0 0 8 8">
                          <path strokeLinecap="round" strokeWidth="1.5" d="M1 1l6 6m0-6L1 7" />
                        </svg>
                      </button>
                    </span>
                  ))}
                </div>
                <div className="mt-4">
                  <label className="text-sm font-medium leading-none">Category</label>
                  <select
                    value={newNote.category}
                    onChange={(e) => setNewNote({ ...newNote, category: e.target.value as any })}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  >
                    <option value="personal">Personal</option>
                    <option value="financial">Financial</option>
                    <option value="meeting">Meeting</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => setIsCreatingNote(false)}>
                  Cancel
                </Button>
                <Button onClick={handleCreateNote}>Save Note</Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="relative
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-5 w-5 text-gray-400" />
        </div>
        <Input
          type="text"
          placeholder="Search notes..."
          className="pl-10 w-full"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <Tabs 
        defaultValue="all" 
        className="space-y-6"
        onValueChange={(value) => setActiveTab(value)}
      >
        <TabsList className="w-full justify-start overflow-x-auto">
          <TabsTrigger value="all">All Notes</TabsTrigger>
          <TabsTrigger value="pinned">Pinned</TabsTrigger>
          <TabsTrigger value="financial">Financial</TabsTrigger>
          <TabsTrigger value="meeting">Meetings</TabsTrigger>
          <TabsTrigger value="personal">Personal</TabsTrigger>
          <TabsTrigger value="archived">Archived</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
          {pinnedNotes.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-4 flex items-center">
                <Pin className="h-4 w-4 mr-2" /> Pinned
              </h3>
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {pinnedNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            </div>
          )}

          <div>
            {pinnedNotes.length > 0 && (
              <h3 className="text-lg font-medium mb-4">All Notes</h3>
            )}
            {activeNotes.length > 0 ? (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {activeNotes.map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12 border-2 border-dashed rounded-lg">
                <p className="text-muted-foreground">No notes found. Create a new note to get started.</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="pinned" className="space-y-6">
          {pinnedNotes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pinnedNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No pinned notes. Pin important notes to keep them here.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="financial" className="space-y-6">
          {filteredNotes.filter(note => note.category === 'financial').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes
                .filter(note => note.category === 'financial')
                .map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No financial notes found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="meeting" className="space-y-6">
          {filteredNotes.filter(note => note.category === 'meeting').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes
                .filter(note => note.category === 'meeting')
                .map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No meeting notes found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-6">
          {filteredNotes.filter(note => note.category === 'personal').length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {filteredNotes
                .filter(note => note.category === 'personal')
                .map((note) => (
                  <NoteCard key={note.id} note={note} />
                ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No personal notes found.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="archived" className="space-y-6">
          {archivedNotes.length > 0 ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {archivedNotes.map((note) => (
                <NoteCard key={note.id} note={note} />
              ))}
            </div>
          ) : (
            <div className="text-center py-12 border-2 border-dashed rounded-lg">
              <p className="text-muted-foreground">No archived notes. Archive notes to hide them from your main view.</p>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
