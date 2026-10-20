import {
  PayloadTooLargeException,
  UnsupportedMediaTypeException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { createHash } from 'node:crypto';
import type { FileUpload } from './documents-manager';
const maxBytes = 10 * 1024 * 1024;
function crc32(bytes: Uint8Array) {
  let value = 0xffffffff;
  for (const byte of bytes) {
    value ^= byte;
    for (let bit = 0; bit < 8; bit++) value = (value >>> 1) ^ (value & 1 ? 0xedb88320 : 0);
  }
  return (value ^ 0xffffffff) >>> 0;
}
function png(bytes: Buffer) {
  if (bytes.length < 45 || bytes.subarray(0, 8).toString('hex') !== '89504e470d0a1a0a')
    return false;
  let offset = 8,
    header = false,
    data = false;
  while (offset + 12 <= bytes.length) {
    const length = bytes.readUInt32BE(offset),
      end = offset + 12 + length;
    if (end > bytes.length) return false;
    const kind = bytes.subarray(offset + 4, offset + 8).toString('ascii');
    if (
      crc32(bytes.subarray(offset + 4, offset + 8 + length)) !==
      bytes.readUInt32BE(offset + 8 + length)
    )
      return false;
    if (!header) {
      if (
        kind !== 'IHDR' ||
        length !== 13 ||
        !bytes.readUInt32BE(offset + 8) ||
        !bytes.readUInt32BE(offset + 12)
      )
        return false;
      header = true;
    }
    if (kind === 'IDAT') data = true;
    if (kind === 'IEND') return length === 0 && data && end === bytes.length;
    offset = end;
  }
  return false;
}
function jpeg(bytes: Buffer) {
  if (
    bytes.length < 12 ||
    bytes[0] !== 255 ||
    bytes[1] !== 216 ||
    bytes[bytes.length - 2] !== 255 ||
    bytes[bytes.length - 1] !== 217
  )
    return false;
  let at = 2,
    frame = false;
  while (at + 3 < bytes.length) {
    if (bytes[at++] !== 255) return false;
    while (bytes[at] === 255) at++;
    const marker = bytes[at++];
    if (marker === 217) return false;
    const length = bytes.readUInt16BE(at);
    if (length < 2 || at + length > bytes.length) return false;
    if ([192, 193, 194, 195, 197, 198, 199, 201, 202, 203, 205, 206, 207].includes(marker)) {
      if (length < 8 || !bytes.readUInt16BE(at + 3) || !bytes.readUInt16BE(at + 5)) return false;
      frame = true;
    }
    if (marker === 218) return frame && at + length < bytes.length - 2;
    at += length;
  }
  return false;
}
export function validatedFile(file: FileUpload) {
  if (!file || !file.bytes || !file.file_name)
    throw new UnprocessableEntityException('Choose a file');
  const bytes = Buffer.from(file.bytes);
  if (bytes.length > maxBytes) throw new PayloadTooLargeException('Files must be at most 10 MiB');
  if (!bytes.length) throw new UnsupportedMediaTypeException('Empty files are not supported');
  if (
    !file.file_name.trim() ||
    file.file_name.length > 180 ||
    /[\\/\u0000-\u001f]/.test(file.file_name)
  )
    throw new UnprocessableEntityException('Use a safe file name without paths');
  let valid = false,
    type = '';
  const magic = bytes.subarray(0, 8).toString('hex');
  if (file.mime_type === 'application/pdf') {
    valid =
      /^%PDF-(1\.[0-7]|2\.0)/.test(bytes.subarray(0, 16).toString('ascii')) &&
      bytes.subarray(-1024).toString('ascii').includes('%%EOF') &&
      bytes.includes(Buffer.from('obj'));
    type = 'pdf';
  } else if (file.mime_type === 'image/png') {
    valid = png(bytes);
    type = 'png';
  } else if (file.mime_type === 'image/jpeg') {
    valid = jpeg(bytes);
    type = 'jpg';
  } else if (file.mime_type === 'text/plain') {
    type = 'txt';
    try {
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      valid =
        !/[\u0000-\u0008\u000b\u000c\u000e-\u001f]/.test(text) &&
        !text.startsWith('%PDF-') &&
        !magic.startsWith('89504e47') &&
        !magic.startsWith('ffd8ff');
    } catch {
      valid = false;
    }
  }
  if (!valid)
    throw new UnsupportedMediaTypeException(
      'File contents must match a supported PDF, PNG, JPEG or UTF-8 text MIME type',
    );
  return {
    bytes,
    file_name: file.file_name,
    mime_type: file.mime_type,
    file_type: type,
    size_bytes: bytes.length,
    sha256: createHash('sha256').update(bytes).digest('hex'),
  };
}
