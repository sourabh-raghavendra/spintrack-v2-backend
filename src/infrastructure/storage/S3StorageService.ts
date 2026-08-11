// Path: server/src/infrastructure/storage/S3StorageService.ts
import { S3Client, PutObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "../../config/env";
import { IStorageService } from "./IStorageService";

export class S3StorageService implements IStorageService {
  private readonly s3: S3Client;
  private readonly bucket: string;

  constructor() {
    this.bucket = env.DO_SPACES_BUCKET;
    this.s3 = new S3Client({
      endpoint: env.DO_SPACES_ENDPOINT,
      region: env.DO_SPACES_REGION,
      credentials: {
        accessKeyId: env.DO_SPACES_KEY,
        secretAccessKey: env.DO_SPACES_SECRET,
      },
      forcePathStyle: true,
    });
  }

  async getPresignedUploadUrl(objectKey: string, contentType: string): Promise<string> {
    const command = new PutObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
      ContentType: contentType,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 900 });
  }

  async getPresignedDownloadUrl(objectKey: string): Promise<string> {
    const command = new GetObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
    });
    return getSignedUrl(this.s3, command, { expiresIn: 900 });
  }

  async deleteObject(objectKey: string): Promise<void> {
    const command = new DeleteObjectCommand({
      Bucket: this.bucket,
      Key: objectKey,
    });
    await this.s3.send(command);
  }
}
