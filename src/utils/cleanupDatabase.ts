/**
 * Database cleanup utility
 * This can be run in the browser console to clean up duplicate collections
 */

import * as db from '@/lib/db';

export async function cleanupDuplicateCollections() {
  console.log('🧹 Starting database cleanup...');
  
  const collections = await db.getAllCollections();
  console.log(`Found ${collections.length} total collections`);
  
  // Group collections by name
  const collectionsByName = new Map<string, typeof collections>();
  
  for (const collection of collections) {
    const existing = collectionsByName.get(collection.name.toLowerCase());
    if (!existing) {
      collectionsByName.set(collection.name.toLowerCase(), [collection]);
    } else {
      existing.push(collection);
    }
  }
  
  // Find and remove duplicates
  let deletedCount = 0;
  let renamedCount = 0;
  
  for (const [name, dupes] of collectionsByName.entries()) {
    if (dupes.length > 1) {
      console.log(`Found ${dupes.length} duplicates of "${name}"`);
      
      // Keep the oldest one (first created)
      const sorted = dupes.sort((a, b) => a.createdAt - b.createdAt);
      const toKeep = sorted[0];
      const toDelete = sorted.slice(1);
      
      console.log(`  Keeping: ${toKeep.id} (created: ${new Date(toKeep.createdAt).toISOString()})`);
      
      for (const duplicate of toDelete) {
        console.log(`  Deleting: ${duplicate.id} (created: ${new Date(duplicate.createdAt).toISOString()})`);
        await db.deleteCollection(duplicate.id);
        deletedCount++;
      }
    }
  }
  
  // Rename "All" to "Miscellaneous" if it exists
  const allCollections = collections.filter(c => c.name === 'All');
  const miscCollections = collections.filter(c => c.name === 'Miscellaneous');
  
  if (allCollections.length > 0 && miscCollections.length === 0) {
    console.log('Renaming "All" collection to "Miscellaneous"...');
    for (const allCollection of allCollections) {
      await db.updateCollection({
        ...allCollection,
        name: 'Miscellaneous',
        icon: 'folder', // Set default folder icon for Miscellaneous
        lastModifiedAt: Date.now(),
      });
      renamedCount++;
      console.log(`  Renamed: ${allCollection.id}`);
    }
  }
  
  console.log(`✅ Cleanup complete! Deleted ${deletedCount} duplicate collections, renamed ${renamedCount} collections.`);
  
  const remainingCollections = await db.getAllCollections();
  console.log(`📊 Remaining collections: ${remainingCollections.length}`);
  remainingCollections.forEach(c => {
    console.log(`  - ${c.name} (${c.id})`);
  });
  
  return {
    deleted: deletedCount,
    renamed: renamedCount,
    remaining: remainingCollections.length,
  };
}

// Make it available globally for console access
if (typeof window !== 'undefined') {
  (window as any).cleanupDatabase = cleanupDuplicateCollections;
}
