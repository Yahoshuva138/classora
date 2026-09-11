// Zero-crash In-Memory Data Store for Classora
// Provides collection-like storage and querying when local MongoDB is not running

class MemoryCollection {
  constructor(name) {
    this.name = name;
    this.docs = [];
  }

  _matches(doc, filter) {
    if (!filter || Object.keys(filter).length === 0) return true;
    for (const key of Object.keys(filter)) {
      if (key === '$or') {
        const orMatches = filter.$or.some(f => this._matches(doc, f));
        if (!orMatches) return false;
        continue;
      }
      const val = filter[key];
      if (val && typeof val === 'object' && !Array.isArray(val)) {
        if ('$ne' in val) {
          if (doc[key] === val.$ne) return false;
          continue;
        }
        if ('$in' in val) {
          if (!val.$in.includes(doc[key])) return false;
          continue;
        }
        if ('$nin' in val) {
          if (val.$nin.includes(doc[key])) return false;
          continue;
        }
        if ('$regex' in val) {
          try {
            const regex = new RegExp(val.$regex, val.$options || '');
            if (!regex.test(String(doc[key] || ''))) return false;
          } catch {
            const escaped = String(val.$regex).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escaped, val.$options || '');
            if (!regex.test(String(doc[key] || ''))) return false;
          }
          continue;
        }
      }
      if (doc[key] !== val) {
        return false;
      }
    }
    return true;
  }

  async find(filter = {}) {
    return this.docs.filter(d => this._matches(d, filter)).map(d => ({ ...d }));
  }

  async findOne(filter = {}) {
    const doc = this.docs.find(d => this._matches(d, filter));
    return doc ? { ...doc } : null;
  }

  async findById(id) {
    const doc = this.docs.find(d => d._id === id || d.id === id || d.rollNo === id);
    return doc ? { ...doc } : null;
  }

  async create(data) {
    const newDoc = {
      _id: `mem_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      ...data
    };
    if (!newDoc.id && newDoc.rollNo) newDoc.id = newDoc.rollNo;
    this.docs.push(newDoc);
    return { ...newDoc };
  }

  async insertMany(items) {
    const inserted = items.map((item, idx) => ({
      _id: `mem_${Date.now()}_${idx}_${Math.random().toString(36).substr(2, 9)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      id: item.id || item.rollNo,
      ...item
    }));
    this.docs.push(...inserted);
    return inserted;
  }

  async updateOne(filter, update, options = {}) {
    const idx = this.docs.findIndex(d => this._matches(d, filter));
    if (idx >= 0) {
      const existing = this.docs[idx];
      const updates = update.$set ? update.$set : update;
      this.docs[idx] = { ...existing, ...updates, updatedAt: new Date().toISOString() };
      return { matchedCount: 1, modifiedCount: 1, doc: { ...this.docs[idx] } };
    } else if (options.upsert) {
      const newDoc = await this.create({ ...filter, ...(update.$set || update) });
      return { matchedCount: 0, modifiedCount: 0, upsertedId: newDoc._id, doc: newDoc };
    }
    return { matchedCount: 0, modifiedCount: 0 };
  }

  async findOneAndUpdate(filter, update, options = { new: true }) {
    const res = await this.updateOne(filter, update, options);
    return res.doc || null;
  }

  async findByIdAndUpdate(id, update, options = { new: true }) {
    return this.findOneAndUpdate({ $or: [{ _id: id }, { id }, { rollNo: id }] }, update, options);
  }

  async deleteOne(filter) {
    const idx = this.docs.findIndex(d => this._matches(d, filter));
    if (idx >= 0) {
      this.docs.splice(idx, 1);
      return { deletedCount: 1 };
    }
    return { deletedCount: 0 };
  }

  async deleteMany(filter = {}) {
    if (!filter || Object.keys(filter).length === 0) {
      const count = this.docs.length;
      this.docs = [];
      return { deletedCount: count };
    }
    const initial = this.docs.length;
    this.docs = this.docs.filter(d => !this._matches(d, filter));
    return { deletedCount: initial - this.docs.length };
  }

  async countDocuments(filter = {}) {
    return this.docs.filter(d => this._matches(d, filter)).length;
  }
}

class MemoryStoreManager {
  constructor() {
    this.collections = new Map();
  }

  collection(name) {
    if (!this.collections.has(name)) {
      this.collections.set(name, new MemoryCollection(name));
    }
    return this.collections.get(name);
  }

  clear() {
    this.collections.clear();
  }
}

export const memoryStore = new MemoryStoreManager();
