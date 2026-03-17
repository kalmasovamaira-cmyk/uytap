import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3Client, PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class FilesService {
  private s3: S3Client;
  private bucket: string;
  private cdnUrl: string;

  constructor(private config: ConfigService) {
    this.s3 = new S3Client({
      endpoint: config.get<string>('S3_ENDPOINT')!,
      region: config.get<string>('S3_REGION', 'us-east-1'),
      credentials: {
        accessKeyId: config.get<string>('S3_ACCESS_KEY')!,
        secretAccessKey: config.get<string>('S3_SECRET_KEY')!,
      },
      forcePathStyle: true, // Required for MinIO
    });
    this.bucket = config.get<string>('S3_BUCKET')!;
    this.cdnUrl = config.get<string>('CDN_URL') || config.get<string>('S3_ENDPOINT')!;
  }

  async uploadImage(buffer: Buffer, mimetype: string, folder = 'listings'): Promise<string> {
    const ext = mimetype.split('/')[1] || 'jpg';
    const key = `${folder}/${uuidv4()}.${ext}`;

    await this.s3.send(
      new PutObjectCommand({
        Bucket: this.bucket,
        Key: key,
        Body: buffer,
        ContentType: mimetype,
        ACL: 'public-read',
      }),
    );

    return `${this.cdnUrl}/${this.bucket}/${key}`;
  }

  async deleteImage(url: string): Promise<void> {
    try {
      const key = url.split(`/${this.bucket}/`)[1];
      if (!key) return;
      await this.s3.send(new DeleteObjectCommand({ Bucket: this.bucket, Key: key }));
    } catch (e) {
      console.error('Failed to delete image:', e);
    }
  }
}
