// Path: server/src/infrastructure/storage/IStorageService.ts
export interface IStorageService {
  getPresignedUploadUrl(objectKey: string, contentType: string): Promise<string>;
  getPresignedDownloadUrl(objectKey: string): Promise<string>;
  deleteObject(objectKey: string): Promise<void>;
}
