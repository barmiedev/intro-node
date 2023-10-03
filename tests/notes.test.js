import { jest } from "@jest/globals";

jest.unstable_mockModule("../src/db.js", () => ({
  insertDB: jest.fn(),
  getDB: jest.fn(),
  saveDB: jest.fn(),
}));

const { insertDB, getDB, saveDB } = await import("../src/db.js");
const {
  newNote,
  getAllNotes,
  findNotes,
  findNotesByTag,
  removeNote,
  removeAllNotes,
} = await import("../src/notes.js");

beforeEach(() => {
  insertDB.mockClear();
  getDB.mockClear();
  saveDB.mockClear();
});

describe("CLI app", () => {
  describe("newNote", () => {
    test("inserts data and returns it", async () => {
      const data = {
        tags: ["tag1", "tag2"],
        content: "test note",
        id: Date.now(),
      };
      insertDB.mockResolvedValue(data);

      const result = await newNote(data.content, data.tags);
      expect(result.content).toEqual(data.content);
      expect(result.tags).toEqual(data.tags);
    });

    test("throws error if no content is provided", async () => {
      const data = {
        tags: ["tag1", "tag2"],
        content: "",
        id: Date.now(),
      };
      insertDB.mockResolvedValue(data);

      await expect(newNote(data.content, data.tags)).rejects.toThrow(
        "Note content cannot be empty"
      );
    });
  });

  describe("getAllNotes", () => {
    test("returns all notes", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await getAllNotes();
      expect(result).toEqual(data.notes);
    });
  });

  describe("removeNote", () => {
    test("removes note by id", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await removeNote(data.notes[0].id);
      expect(result).toEqual(data.notes[0].id);
    });

    test("does nothing if id is not found", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await removeNote(1234);
      expect(result).toEqual(undefined);
    });
  });

  describe("removeAllNotes", () => {
    test("removes all notes", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await removeAllNotes();
      expect(result).toEqual(undefined);
    });
  });

  describe("findNotes", () => {
    test("returns notes that match filter", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotes("test");
      expect(result).toEqual(data.notes);
    });

    test("returns empty array if no notes match filter", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotes("foo");
      expect(result).toEqual([]);
    });

    test("returns empty array if no notes are found", async () => {
      const data = {
        notes: [],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotes("foo");
      expect(result).toEqual([]);
    });

    test("finds notes regardless of case", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotes("TEST");
      expect(result).toEqual(data.notes);
    });

    test("finds notes by tag", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotes("#tag1");
      expect(result).toEqual([data.notes[0]]);
    });

    test("finds notes by tag if hash is in content", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "#test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "#test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotes("#2");
      expect(result).toEqual([data.notes[1]]);
    });
  });

  describe("find-tag", () => {
    test("returns notes that match tag", async () => {
      const data = {
        notes: [
          {
            tags: ["tag1", "tag2"],
            content: "test note #1",
            id: Date.now(),
          },
          {
            tags: ["tag3", "tag4"],
            content: "test note #2",
            id: Date.now(),
          },
        ],
      };
      getDB.mockResolvedValue(data);

      const result = await findNotesByTag("tag1");
      expect(result).toEqual([data.notes[0]]);
    });
  });

  test("returns empty array if no notes match tag", async () => {
    const data = {
      notes: [
        {
          tags: ["tag1", "tag2"],
          content: "test note #1",
          id: Date.now(),
        },
        {
          tags: ["tag3", "tag4"],
          content: "test note #2",
          id: Date.now(),
        },
      ],
    };
    getDB.mockResolvedValue(data);

    const result = await findNotesByTag("foo");
    expect(result).toEqual([]);
  });
});
