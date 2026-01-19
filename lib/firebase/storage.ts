import {
    ref,
    uploadBytes,
    getDownloadURL,
    deleteObject,
    UploadMetadata
} from "firebase/storage";
import { getFirebaseStorage } from "./config";
import { requireUserId } from "./auth";

/**
 * Get storage path for a vacancy file
 */
function getFilePath(uid: string, vacancyId: string, fileId: string, fileName: string): string {
    return `users/${uid}/vacancies/${vacancyId}/files/${fileId}/${fileName}`;
}

/**
 * Upload a file to Firebase Storage
 */
export async function uploadVacancyFile(
    vacancyId: string,
    fileId: string,
    file: File
): Promise<{ storagePath: string; downloadUrl: string }> {
    const uid = requireUserId();
    const storage = getFirebaseStorage();

    const storagePath = getFilePath(uid, vacancyId, fileId, file.name);
    const storageRef = ref(storage, storagePath);

    const metadata: UploadMetadata = {
        contentType: file.type,
        customMetadata: {
            originalName: file.name,
            uploadedBy: uid,
            vacancyId: vacancyId,
        },
    };

    await uploadBytes(storageRef, file, metadata);
    const downloadUrl = await getDownloadURL(storageRef);

    console.log("[Storage] Uploaded file:", storagePath);
    return { storagePath, downloadUrl };
}

/**
 * Delete a file from Firebase Storage
 */
export async function deleteVacancyFile(storagePath: string): Promise<void> {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, storagePath);

    try {
        await deleteObject(storageRef);
        console.log("[Storage] Deleted file:", storagePath);
    } catch (error) {
        // File might not exist, log but don't throw
        console.warn("[Storage] Failed to delete file:", storagePath, error);
    }
}

/**
 * Get download URL for a file
 */
export async function getFileDownloadUrl(storagePath: string): Promise<string> {
    const storage = getFirebaseStorage();
    const storageRef = ref(storage, storagePath);
    return getDownloadURL(storageRef);
}
