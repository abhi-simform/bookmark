import { openDB, DBSchema, IDBPDatabase } from 'idb';
import type { Bookmark, Collection, Tag } from '@/types';

interface BookmarkDB extends DBSchema {
  bookmarks: {
    key: string;
    value: Bookmark;
    indexes: {
      'by-collection': string;
      'by-favorite': number;
      'by-archived': number;
      'by-created': number;
    };
  };
  collections: {
    key: string;
    value: Collection;
    indexes: {
      'by-parent': string;
      'by-order': number;
    };
  };
  tags: {
    key: string;
    value: Tag;
  };
}

let dbInstance: IDBPDatabase<BookmarkDB> | null = null;

export async function initDB(): Promise<IDBPDatabase<BookmarkDB>> {
  if (dbInstance) return dbInstance;

  dbInstance = await openDB<BookmarkDB>('bookmark-pwa-db', 1, {
    upgrade(db) {
      // Bookmarks store
      const bookmarkStore = db.createObjectStore('bookmarks', {
        keyPath: 'id',
      });
      bookmarkStore.createIndex('by-collection', 'collectionId');
      bookmarkStore.createIndex('by-favorite', 'isFavorite');
      bookmarkStore.createIndex('by-archived', 'isArchived');
      bookmarkStore.createIndex('by-created', 'createdAt');

      // Collections store
      const collectionStore = db.createObjectStore('collections', {
        keyPath: 'id',
      });
      collectionStore.createIndex('by-parent', 'parentId');
      collectionStore.createIndex('by-order', 'order');

      // Tags store
      db.createObjectStore('tags', {
        keyPath: 'id',
      });
    },
  });

  return dbInstance;
}

export async function getDB() {
  if (!dbInstance) {
    return await initDB();
  }
  return dbInstance;
}

// Bookmark operations
export async function getAllBookmarks(): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAll('bookmarks');
}

export async function getBookmarkById(id: string): Promise<Bookmark | undefined> {
  const db = await getDB();
  return db.get('bookmarks', id);
}

export async function addBookmark(bookmark: Bookmark): Promise<string> {
  const db = await getDB();
  await db.add('bookmarks', bookmark);
  return bookmark.id;
}

export async function updateBookmark(bookmark: Bookmark): Promise<void> {
  const db = await getDB();
  await db.put('bookmarks', bookmark);
}

export async function deleteBookmark(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('bookmarks', id);
}

export async function getBookmarksByCollection(collectionId: string): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAllFromIndex('bookmarks', 'by-collection', collectionId);
}

export async function getFavoriteBookmarks(): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAllFromIndex('bookmarks', 'by-favorite', 1);
}

export async function getArchivedBookmarks(): Promise<Bookmark[]> {
  const db = await getDB();
  return db.getAllFromIndex('bookmarks', 'by-archived', 1);
}

// Collection operations
export async function getAllCollections(): Promise<Collection[]> {
  const db = await getDB();
  return db.getAll('collections');
}

export async function getCollectionById(id: string): Promise<Collection | undefined> {
  const db = await getDB();
  return db.get('collections', id);
}

export async function addCollection(collection: Collection): Promise<string> {
  const db = await getDB();
  await db.add('collections', collection);
  return collection.id;
}

export async function updateCollection(collection: Collection): Promise<void> {
  const db = await getDB();
  await db.put('collections', collection);
}

export async function deleteCollection(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('collections', id);
}

// Tag operations
export async function getAllTags(): Promise<Tag[]> {
  const db = await getDB();
  return db.getAll('tags');
}

export async function addTag(tag: Tag): Promise<void> {
  const db = await getDB();
  await db.put('tags', tag);
}

export async function deleteTag(id: string): Promise<void> {
  const db = await getDB();
  await db.delete('tags', id);
}

// Batch operations
export async function batchDeleteBookmarks(ids: string[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('bookmarks', 'readwrite');
  await Promise.all([
    ...ids.map((id) => tx.store.delete(id)),
    tx.done,
  ]);
}

export async function batchUpdateBookmarks(bookmarks: Bookmark[]): Promise<void> {
  const db = await getDB();
  const tx = db.transaction('bookmarks', 'readwrite');
  await Promise.all([
    ...bookmarks.map((bookmark) => tx.store.put(bookmark)),
    tx.done,
  ]);
}

// Clear all data (for user sign out)
export async function clearAllData(): Promise<void> {
  const db = await getDB();
  const tx = db.transaction(['bookmarks', 'collections', 'tags'], 'readwrite');
  await Promise.all([
    tx.objectStore('bookmarks').clear(),
    tx.objectStore('collections').clear(),
    tx.objectStore('tags').clear(),
    tx.done,
  ]);
}
