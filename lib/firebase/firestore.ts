import {
    collection,
    doc,
    getDoc,
    getDocs,
    setDoc,
    updateDoc,
    deleteDoc,
    addDoc,
    query,
    orderBy,
    serverTimestamp,
    Timestamp,
    writeBatch,
    DocumentReference,
    QueryDocumentSnapshot
} from "firebase/firestore";
import { getFirebaseDb } from "./config";
import { requireUserId } from "./auth";

// ----- Types -----

export interface VacancyDoc {
    title: string;
    status: "draft" | "analyzing" | "persona_ready" | "approved";
    createdAt: Timestamp;
    updatedAt: Timestamp;
    lastOpenedAt: Timestamp;
    version: number;
    summary?: string;
    extractedText?: string;
    threadId?: string | null;
}

export interface MessageDoc {
    role: "user" | "assistant" | "system";
    content: string;
    createdAt: Timestamp;
}

export interface FileDoc {
    originalName: string;
    storagePath: string;
    contentType: string;
    sizeBytes: number;
    uploadedAt: Timestamp;
    extractionStatus: "pending" | "processing" | "ready" | "failed";
    extractedText?: string;
    openaiFileId?: string | null;
    vectorStoreId?: string | null;
}

export interface LinkDoc {
    url: string;
    title?: string;
    createdAt: Timestamp;
}

export interface NoteDoc {
    content: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}

export interface PersonaDoc {
    type: string;
    headline: string;
    summary: string;
    coreSkills: string[];
    domainExperience: string[];
    typicalEmployers: string[];
    salaryBand: { min: number; max: number; currency: string; note: string };
    noticePeriod: string;
    redFlags: string[];
    outreachAngle: string;
    booleanSearchStrings: string[];
    approved: boolean;
    createdAt: Timestamp;
}

// ----- Helper: Get collection paths -----

function getUserPath(uid: string) {
    return `users/${uid}`;
}

function getVacanciesPath(uid: string) {
    return `users/${uid}/vacancies`;
}

function getVacancyPath(uid: string, vacancyId: string) {
    return `users/${uid}/vacancies/${vacancyId}`;
}

// ----- Vacancy CRUD -----

export async function createVacancy(title: string = "New Vacancy"): Promise<string> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const vacancyData: VacancyDoc = {
        title,
        status: "draft",
        createdAt: serverTimestamp() as Timestamp,
        updatedAt: serverTimestamp() as Timestamp,
        lastOpenedAt: serverTimestamp() as Timestamp,
        version: 1,
    };

    const ref = await addDoc(collection(db, getVacanciesPath(uid)), vacancyData);
    console.log("[Firestore] Created vacancy:", ref.id);
    return ref.id;
}

export async function getVacancy(vacancyId: string): Promise<VacancyDoc & { id: string } | null> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const docRef = doc(db, getVacancyPath(uid, vacancyId));
    const docSnap = await getDoc(docRef);

    if (!docSnap.exists()) {
        return null;
    }

    return { id: docSnap.id, ...docSnap.data() as VacancyDoc };
}

export async function updateVacancy(vacancyId: string, data: Partial<VacancyDoc>): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const docRef = doc(db, getVacancyPath(uid, vacancyId));
    await updateDoc(docRef, {
        ...data,
        updatedAt: serverTimestamp(),
    });
    console.log("[Firestore] Updated vacancy:", vacancyId);
}

export async function deleteVacancy(vacancyId: string): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    // Delete main document (subcollections should be handled by Cloud Function or batched)
    const docRef = doc(db, getVacancyPath(uid, vacancyId));
    await deleteDoc(docRef);
    console.log("[Firestore] Deleted vacancy:", vacancyId);
}

export async function listVacancies(): Promise<Array<VacancyDoc & { id: string }>> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const q = query(
        collection(db, getVacanciesPath(uid)),
        orderBy("updatedAt", "desc")
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as VacancyDoc,
    }));
}

// ----- Messages Subcollection -----

export async function addMessage(vacancyId: string, message: Omit<MessageDoc, "createdAt">): Promise<string> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const messagesPath = `${getVacancyPath(uid, vacancyId)}/messages`;
    const ref = await addDoc(collection(db, messagesPath), {
        ...message,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getMessages(vacancyId: string): Promise<Array<MessageDoc & { id: string }>> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const messagesPath = `${getVacancyPath(uid, vacancyId)}/messages`;
    const q = query(collection(db, messagesPath), orderBy("createdAt", "asc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as MessageDoc,
    }));
}

// ----- Files Subcollection -----

export async function addFile(vacancyId: string, file: Omit<FileDoc, "uploadedAt">): Promise<string> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const filesPath = `${getVacancyPath(uid, vacancyId)}/files`;
    const ref = await addDoc(collection(db, filesPath), {
        ...file,
        uploadedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getFiles(vacancyId: string): Promise<Array<FileDoc & { id: string }>> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const filesPath = `${getVacancyPath(uid, vacancyId)}/files`;
    const q = query(collection(db, filesPath), orderBy("uploadedAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as FileDoc,
    }));
}

export async function updateFile(vacancyId: string, fileId: string, data: Partial<FileDoc>): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const filePath = `${getVacancyPath(uid, vacancyId)}/files/${fileId}`;
    await updateDoc(doc(db, filePath), data);
}

export async function deleteFile(vacancyId: string, fileId: string): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const filePath = `${getVacancyPath(uid, vacancyId)}/files/${fileId}`;
    await deleteDoc(doc(db, filePath));
}

// ----- Notes Subcollection -----

export async function addNote(vacancyId: string, content: string): Promise<string> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const notesPath = `${getVacancyPath(uid, vacancyId)}/notes`;
    const ref = await addDoc(collection(db, notesPath), {
        content,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getNotes(vacancyId: string): Promise<Array<NoteDoc & { id: string }>> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const notesPath = `${getVacancyPath(uid, vacancyId)}/notes`;
    const q = query(collection(db, notesPath), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as NoteDoc,
    }));
}

export async function updateNote(vacancyId: string, noteId: string, content: string): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const notePath = `${getVacancyPath(uid, vacancyId)}/notes/${noteId}`;
    await updateDoc(doc(db, notePath), {
        content,
        updatedAt: serverTimestamp(),
    });
}

export async function deleteNote(vacancyId: string, noteId: string): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const notePath = `${getVacancyPath(uid, vacancyId)}/notes/${noteId}`;
    await deleteDoc(doc(db, notePath));
}

// ----- Links Subcollection -----

export async function addLink(vacancyId: string, url: string, title?: string): Promise<string> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const linksPath = `${getVacancyPath(uid, vacancyId)}/links`;
    const ref = await addDoc(collection(db, linksPath), {
        url,
        title,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getLinks(vacancyId: string): Promise<Array<LinkDoc & { id: string }>> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const linksPath = `${getVacancyPath(uid, vacancyId)}/links`;
    const q = query(collection(db, linksPath), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as LinkDoc,
    }));
}

export async function deleteLink(vacancyId: string, linkId: string): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const linkPath = `${getVacancyPath(uid, vacancyId)}/links/${linkId}`;
    await deleteDoc(doc(db, linkPath));
}

// ----- Personas Subcollection -----

export async function addPersona(vacancyId: string, persona: Omit<PersonaDoc, "createdAt">): Promise<string> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const personasPath = `${getVacancyPath(uid, vacancyId)}/personas`;
    const ref = await addDoc(collection(db, personasPath), {
        ...persona,
        createdAt: serverTimestamp(),
    });
    return ref.id;
}

export async function getPersonas(vacancyId: string): Promise<Array<PersonaDoc & { id: string }>> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const personasPath = `${getVacancyPath(uid, vacancyId)}/personas`;
    const q = query(collection(db, personasPath), orderBy("createdAt", "desc"));
    const snapshot = await getDocs(q);

    return snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data() as PersonaDoc,
    }));
}

export async function updatePersona(vacancyId: string, personaId: string, data: Partial<PersonaDoc>): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const personaPath = `${getVacancyPath(uid, vacancyId)}/personas/${personaId}`;
    await updateDoc(doc(db, personaPath), data);
}

export async function deletePersona(vacancyId: string, personaId: string): Promise<void> {
    const uid = requireUserId();
    const db = getFirebaseDb();

    const personaPath = `${getVacancyPath(uid, vacancyId)}/personas/${personaId}`;
    await deleteDoc(doc(db, personaPath));
}
