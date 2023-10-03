import { insertDB, getDB, saveDB } from "./db.js";

export const newNote = async (note, tags) => {
  if (!note) {
    throw new Error("Note content cannot be empty");
  }

  const newNote = {
    tags,
    id: Date.now(),
    content: note,
  };

  await insertDB(newNote);
  return newNote;
};

export const getAllNotes = async () => {
  const { notes } = await getDB();
  return notes;
};

export const findNotes = async (filter) => {
  const { notes } = await getDB();

  // find notes by tag
  if (filter.startsWith("#")) {
    const tag = filter.slice(1);
    return notes.filter(
      (note) => note.tags.includes(tag) || note.content.includes(tag)
    );
  }

  // find nodes matching content filter
  return notes.filter((note) => {
    return note.content.toLowerCase().includes(filter.toLowerCase());
  });
};

export const findNotesByTag = async (tag) => {
  const { notes } = await getDB();
  return notes.filter((note) => note.tags.includes(tag));
};

export const removeNote = async (id) => {
  const { notes } = await getDB();
  const match = notes.find((note) => note.id === id);
  if (match) {
    const newNotes = notes.filter((note) => note.id !== id);
    await saveDB({ notes: newNotes });
    return id;
  }
};

export const removeAllNotes = () => saveDB({ notes: [] });
