// IndexedDB wrapper for offline storage
export class OfflineStorage {
  constructor() {
    this.dbName = 'MindMateDB';
    this.version = 1;
    this.db = null;
  }

  async init() {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.version);
      
      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      
      request.onupgradeneeded = (event) => {
        const db = event.target.result;
        
        // Create stores
        if (!db.objectStoreNames.contains('messages')) {
          const messageStore = db.createObjectStore('messages', { keyPath: 'id', autoIncrement: true });
          messageStore.createIndex('timestamp', 'timestamp');
        }
        
        if (!db.objectStoreNames.contains('coping_strategies')) {
          db.createObjectStore('coping_strategies', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  async saveMessage(message) {
    const transaction = this.db.transaction(['messages'], 'readwrite');
    const store = transaction.objectStore('messages');
    return store.add(message);
  }

  async getMessages(limit = 50) {
    const transaction = this.db.transaction(['messages'], 'readonly');
    const store = transaction.objectStore('messages');
    const index = store.index('timestamp');
    return new Promise((resolve, reject) => {
      const messages = [];
      const request = index.openCursor(null, 'prev');
      
      request.onsuccess = (event) => {
        const cursor = event.target.result;
        if (cursor && messages.length < limit) {
          messages.push(cursor.value);
          cursor.continue();
        } else {
          resolve(messages.reverse());
        }
      };
      
      request.onerror = () => reject(request.error);
    });
  }
}