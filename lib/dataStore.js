import mongoose from 'mongoose';
import connectToDatabase from './mongodb.js';
import Project from '../models/Project.js';
import Program from '../models/Program.js';
import Gallery from '../models/Gallery.js';
import Document from '../models/Document.js';

// Use globalThis to persist cache across API route calls in Next.js
if (!globalThis._ss_data_store) {
  globalThis._ss_data_store = {
    projects: [
      {
        _id: 'proj_1',
        id: 'proj_1',
        title: 'Winter Sweater & Warm Clothes Distribution',
        description: 'A dedicated winter relief campaign providing high quality sweaters, thermals, and blankets to children in need across underserved communities.',
        image_urls: ['/assets/hompage2.jpg', '/assets/hompage4.jpg'],
        category: 'Welfare Project',
        location: 'Delhi NCR',
        status: 'In Progress',
        created_at: '2026-01-15T10:00:00.000Z',
      },
      {
        _id: 'proj_2',
        id: 'proj_2',
        title: 'Vidyanjali Government School Outreach',
        description: 'Collaborating with community schools to support teaching infrastructure, stationery kits, and digital literacy for slum children.',
        image_urls: ['/assets/hompage3.jpg', '/assets/hompage5.jpg'],
        category: 'Education Project',
        location: 'New Delhi',
        status: 'Active',
        created_at: '2026-02-10T10:00:00.000Z',
      },
    ],
    programs: [
      {
        _id: 'prog_1',
        id: 'prog_1',
        title: 'Education for Underprivileged Children',
        description: 'Providing basic learning, uniforms, books, school bags, and coaching to poor children in slums and informal settlements.',
        image_urls: ['/assets/hompage1.jpg', '/assets/hompage2.jpg'],
        category: 'Education',
        location: 'Shaheen Bagh, Delhi',
        status: 'Active & Ongoing',
        created_at: '2026-01-05T10:00:00.000Z',
      },
      {
        _id: 'prog_2',
        id: 'prog_2',
        title: 'Free Healthcare Camps & Medical Checkups',
        description: 'Conducting periodic medical diagnostic camps, distribution of basic medicines, and health awareness sessions for families.',
        image_urls: ['/assets/hompage3.jpg', '/assets/hompage4.jpg'],
        category: 'Healthcare',
        location: 'Jamia Nagar & Okhla, Delhi',
        status: 'Active & Ongoing',
        created_at: '2026-01-12T10:00:00.000Z',
      },
      {
        _id: 'prog_3',
        id: 'prog_3',
        title: 'Nutritious Meal & Food Relief Drives',
        description: 'Regular dry ration kits and cooked food distribution drives for daily wage workers, homeless, and vulnerable families.',
        image_urls: ['/assets/hompage5.jpg', '/assets/hompage1.jpg'],
        category: 'Nutrition',
        location: 'Delhi NCR',
        status: 'Active & Ongoing',
        created_at: '2026-01-20T10:00:00.000Z',
      },
    ],
    gallery: [
      { _id: 'gal_1', id: 'gal_1', title: 'Education Kit Distribution Day', image_url: '/assets/hompage1.jpg', category: 'Education', created_at: '2026-01-01T10:00:00.000Z' },
      { _id: 'gal_2', id: 'gal_2', title: 'Community Health Awareness Session', image_url: '/assets/hompage3.jpg', category: 'Healthcare', created_at: '2026-01-05T10:00:00.000Z' },
      { _id: 'gal_3', id: 'gal_3', title: 'Warm Clothes & Sweater Distribution', image_url: '/assets/hompage2.jpg', category: 'Community', created_at: '2026-01-10T10:00:00.000Z' },
      { _id: 'gal_4', id: 'gal_4', title: 'Food Drive for Underprivileged Families', image_url: '/assets/hompage5.jpg', category: 'Events', created_at: '2026-01-15T10:00:00.000Z' },
      { _id: 'gal_5', id: 'gal_5', title: 'Annual Volunteers Meet', image_url: '/assets/hompage4.jpg', category: 'Events', created_at: '2026-01-20T10:00:00.000Z' },
    ],
    documents: [
      {
        _id: 'doc_1',
        id: 'doc_1',
        title: 'Spread Smiles Trust Registration Certificate',
        description: 'Official Government registered NGO trust deed and certificate of registration.',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: 'Certificates',
        created_at: '2026-01-01T10:00:00.000Z',
      },
      {
        _id: 'doc_2',
        id: 'doc_2',
        title: 'Annual Social Impact Report 2024-2025',
        description: 'Comprehensive report highlighting our initiatives, lives impacted, and financial transparency.',
        file_url: 'https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf',
        category: 'Reports',
        created_at: '2026-01-10T10:00:00.000Z',
      },
    ],
  };
}

const store = globalThis._ss_data_store;

// Helper to match an item by ID safely
function matchesId(item, id) {
  if (!item || !id) return false;
  const strId = String(id);
  return (
    String(item.id) === strId ||
    String(item._id) === strId ||
    (item._id && item._id.toString && item._id.toString() === strId)
  );
}

// ----------------------------------------------------------------------
// PROJECTS
// ----------------------------------------------------------------------
export async function getProjects() {
  try {
    await connectToDatabase();
    const dbProjects = await Project.find({}).sort({ created_at: -1 }).lean();
    if (dbProjects && dbProjects.length > 0) {
      // Merge with in-memory projects (in-memory created takes priority)
      const merged = [...dbProjects];
      for (const memItem of store.projects) {
        if (!merged.some((m) => matchesId(m, memItem.id || memItem._id))) {
          merged.unshift(memItem);
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB read failed for projects, using cache:', err.message);
  }
  return store.projects;
}

export async function getProjectById(id) {
  // 1. Check in-memory store first for newly added or fallback items
  const cached = store.projects.find((p) => matchesId(p, id));
  if (cached) {
    return cached;
  }

  // 2. Check MongoDB
  try {
    await connectToDatabase();
    let dbItem = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbItem = await Project.findById(id).lean();
    }
    if (!dbItem) {
      dbItem = await Project.findOne({ $or: [{ _id: id }, { id }] }).lean();
    }
    if (dbItem) {
      return dbItem;
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB fetch failed for project', id, err.message);
  }

  return null;
}

export async function createProject(data) {
  const newId = 'proj_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  const newItem = {
    _id: newId,
    id: newId,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  // Add to in-memory store immediately
  store.projects.unshift(newItem);

  // Try saving to DB if reachable
  try {
    await connectToDatabase();
    const dbDoc = await Project.create(data);
    const result = dbDoc.toJSON ? dbDoc.toJSON() : dbDoc;
    // Update the memory store item with DB _id
    newItem._id = result._id ? String(result._id) : newId;
    newItem.id = newItem._id;
    return result;
  } catch (err) {
    console.warn('⚠️ [DataStore] MongoDB save failed for project, preserved in cache:', err.message);
  }

  return newItem;
}

export async function updateProject(id, data) {
  // Update in-memory
  const idx = store.projects.findIndex((p) => matchesId(p, id));
  if (idx !== -1) {
    store.projects[idx] = { ...store.projects[idx], ...data, updated_at: new Date().toISOString() };
  }

  // Update in DB
  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Project.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    }
    await Project.updateOne({ $or: [{ _id: id }, { id }] }, data);
  } catch (err) {
    console.warn('⚠️ [DataStore] DB update failed for project', id, err.message);
  }

  return idx !== -1 ? store.projects[idx] : { id, ...data };
}

export async function deleteProject(id) {
  // 1. Remove from in-memory store
  const beforeLen = store.projects.length;
  store.projects = store.projects.filter((p) => !matchesId(p, id));
  const removedFromCache = store.projects.length < beforeLen;

  // 2. Remove from DB if connected
  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Project.findByIdAndDelete(id);
    } else {
      await Project.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB delete failed for project', id, err.message);
  }

  return { success: true, removed: removedFromCache };
}

// ----------------------------------------------------------------------
// PROGRAMS
// ----------------------------------------------------------------------
export async function getPrograms() {
  try {
    await connectToDatabase();
    const dbPrograms = await Program.find({}).sort({ created_at: -1 }).lean();
    if (dbPrograms && dbPrograms.length > 0) {
      const merged = [...dbPrograms];
      for (const memItem of store.programs) {
        if (!merged.some((m) => matchesId(m, memItem.id || memItem._id))) {
          merged.unshift(memItem);
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB read failed for programs, using cache:', err.message);
  }
  return store.programs;
}

export async function getProgramById(id) {
  const cached = store.programs.find((p) => matchesId(p, id));
  if (cached) {
    return cached;
  }

  try {
    await connectToDatabase();
    let dbItem = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbItem = await Program.findById(id).lean();
    }
    if (!dbItem) {
      dbItem = await Program.findOne({ $or: [{ _id: id }, { id }] }).lean();
    }
    if (dbItem) {
      return dbItem;
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB fetch failed for program', id, err.message);
  }

  return null;
}

export async function createProgram(data) {
  const newId = 'prog_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  const newItem = {
    _id: newId,
    id: newId,
    ...data,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  store.programs.unshift(newItem);

  try {
    await connectToDatabase();
    const dbDoc = await Program.create(data);
    const result = dbDoc.toJSON ? dbDoc.toJSON() : dbDoc;
    newItem._id = result._id ? String(result._id) : newId;
    newItem.id = newItem._id;
    return result;
  } catch (err) {
    console.warn('⚠️ [DataStore] MongoDB save failed for program, preserved in cache:', err.message);
  }

  return newItem;
}

export async function updateProgram(id, data) {
  const idx = store.programs.findIndex((p) => matchesId(p, id));
  if (idx !== -1) {
    store.programs[idx] = { ...store.programs[idx], ...data, updated_at: new Date().toISOString() };
  }

  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Program.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    }
    await Program.updateOne({ $or: [{ _id: id }, { id }] }, data);
  } catch (err) {
    console.warn('⚠️ [DataStore] DB update failed for program', id, err.message);
  }

  return idx !== -1 ? store.programs[idx] : { id, ...data };
}

export async function deleteProgram(id) {
  const beforeLen = store.programs.length;
  store.programs = store.programs.filter((p) => !matchesId(p, id));
  const removedFromCache = store.programs.length < beforeLen;

  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Program.findByIdAndDelete(id);
    } else {
      await Program.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB delete failed for program', id, err.message);
  }

  return { success: true, removed: removedFromCache };
}

// ----------------------------------------------------------------------
// GALLERY
// ----------------------------------------------------------------------
export async function getGallery() {
  try {
    await connectToDatabase();
    const dbGallery = await Gallery.find({}).sort({ created_at: -1 }).lean();
    if (dbGallery && dbGallery.length > 0) {
      const merged = [...dbGallery];
      for (const memItem of store.gallery) {
        if (!merged.some((m) => matchesId(m, memItem.id || memItem._id))) {
          merged.unshift(memItem);
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB read failed for gallery, using cache:', err.message);
  }
  return store.gallery;
}

export async function getGalleryById(id) {
  const cached = store.gallery.find((g) => matchesId(g, id));
  if (cached) return cached;

  try {
    await connectToDatabase();
    let dbItem = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbItem = await Gallery.findById(id).lean();
    }
    if (!dbItem) {
      dbItem = await Gallery.findOne({ $or: [{ _id: id }, { id }] }).lean();
    }
    if (dbItem) return dbItem;
  } catch (err) {
    console.warn('⚠️ [DataStore] DB fetch failed for gallery', id, err.message);
  }

  return null;
}

export async function createGallery(data) {
  const newId = 'gal_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  const newItem = {
    _id: newId,
    id: newId,
    ...data,
    created_at: new Date().toISOString(),
  };

  store.gallery.unshift(newItem);

  try {
    await connectToDatabase();
    const dbDoc = await Gallery.create(data);
    const result = dbDoc.toJSON ? dbDoc.toJSON() : dbDoc;
    newItem._id = result._id ? String(result._id) : newId;
    newItem.id = newItem._id;
    return result;
  } catch (err) {
    console.warn('⚠️ [DataStore] MongoDB save failed for gallery, preserved in cache:', err.message);
  }

  return newItem;
}

export async function updateGallery(id, data) {
  const idx = store.gallery.findIndex((g) => matchesId(g, id));
  if (idx !== -1) {
    store.gallery[idx] = { ...store.gallery[idx], ...data };
  }

  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Gallery.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    }
    await Gallery.updateOne({ $or: [{ _id: id }, { id }] }, data);
  } catch (err) {
    console.warn('⚠️ [DataStore] DB update failed for gallery', id, err.message);
  }

  return idx !== -1 ? store.gallery[idx] : { id, ...data };
}

export async function deleteGallery(id) {
  const beforeLen = store.gallery.length;
  store.gallery = store.gallery.filter((g) => !matchesId(g, id));
  const removedFromCache = store.gallery.length < beforeLen;

  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Gallery.findByIdAndDelete(id);
    } else {
      await Gallery.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB delete failed for gallery', id, err.message);
  }

  return { success: true, removed: removedFromCache };
}

// ----------------------------------------------------------------------
// DOCUMENTS
// ----------------------------------------------------------------------
export async function getDocuments() {
  try {
    await connectToDatabase();
    const dbDocs = await Document.find({}).sort({ created_at: -1 }).lean();
    if (dbDocs && dbDocs.length > 0) {
      const merged = [...dbDocs];
      for (const memItem of store.documents) {
        if (!merged.some((m) => matchesId(m, memItem.id || memItem._id))) {
          merged.unshift(memItem);
        }
      }
      return merged;
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB read failed for documents, using cache:', err.message);
  }
  return store.documents;
}

export async function getDocumentById(id) {
  const cached = store.documents.find((d) => matchesId(d, id));
  if (cached) return cached;

  try {
    await connectToDatabase();
    let dbItem = null;
    if (mongoose.Types.ObjectId.isValid(id)) {
      dbItem = await Document.findById(id).lean();
    }
    if (!dbItem) {
      dbItem = await Document.findOne({ $or: [{ _id: id }, { id }] }).lean();
    }
    if (dbItem) return dbItem;
  } catch (err) {
    console.warn('⚠️ [DataStore] DB fetch failed for document', id, err.message);
  }

  return null;
}

export async function createDocument(data) {
  const newId = 'doc_' + Date.now() + '_' + Math.random().toString(36).substring(7);
  const newItem = {
    _id: newId,
    id: newId,
    ...data,
    created_at: new Date().toISOString(),
  };

  store.documents.unshift(newItem);

  try {
    await connectToDatabase();
    const dbDoc = await Document.create(data);
    const result = dbDoc.toJSON ? dbDoc.toJSON() : dbDoc;
    newItem._id = result._id ? String(result._id) : newId;
    newItem.id = newItem._id;
    return result;
  } catch (err) {
    console.warn('⚠️ [DataStore] MongoDB save failed for document, preserved in cache:', err.message);
  }

  return newItem;
}

export async function updateDocument(id, data) {
  const idx = store.documents.findIndex((d) => matchesId(d, id));
  if (idx !== -1) {
    store.documents[idx] = { ...store.documents[idx], ...data };
  }

  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      const updated = await Document.findByIdAndUpdate(id, data, { new: true }).lean();
      if (updated) return updated;
    }
    await Document.updateOne({ $or: [{ _id: id }, { id }] }, data);
  } catch (err) {
    console.warn('⚠️ [DataStore] DB update failed for document', id, err.message);
  }

  return idx !== -1 ? store.documents[idx] : { id, ...data };
}

export async function deleteDocument(id) {
  const beforeLen = store.documents.length;
  store.documents = store.documents.filter((d) => !matchesId(d, id));
  const removedFromCache = store.documents.length < beforeLen;

  try {
    await connectToDatabase();
    if (mongoose.Types.ObjectId.isValid(id)) {
      await Document.findByIdAndDelete(id);
    } else {
      await Document.deleteOne({ $or: [{ _id: id }, { id }] });
    }
  } catch (err) {
    console.warn('⚠️ [DataStore] DB delete failed for document', id, err.message);
  }

  return { success: true, removed: removedFromCache };
}
