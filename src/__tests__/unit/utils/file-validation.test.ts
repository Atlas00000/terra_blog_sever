import {
  validateFile,
  validateImage,
  validateVideo,
  validateDocument,
  getFileExtension,
  generateUniqueFilename,
  isImage,
  isVideo,
} from '../../../utils/file-validation';

describe('FileValidation', () => {
  const createMockFile = (overrides: Partial<Express.Multer.File> = {}): Express.Multer.File => ({
    fieldname: 'file',
    originalname: 'test.jpg',
    encoding: '7bit',
    mimetype: 'image/jpeg',
    size: 1024,
    buffer: Buffer.from('test'),
    destination: '',
    filename: 'test.jpg',
    path: '',
    stream: {} as any,
    ...overrides,
  });

  describe('validateFile', () => {
    it('should validate file within size limit', () => {
      const file = createMockFile({ size: 1024 });
      const result = validateFile(file, { maxSize: 2048 });

      expect(result.valid).toBe(true);
    });

    it('should reject file exceeding size limit', () => {
      const file = createMockFile({ size: 2048 });
      const result = validateFile(file, { maxSize: 1024 });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('exceeds maximum');
    });

    it('should validate MIME type when allowed types specified', () => {
      const file = createMockFile({ mimetype: 'image/jpeg' });
      const result = validateFile(file, {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
      });

      expect(result.valid).toBe(true);
    });

    it('should reject file with invalid MIME type', () => {
      const file = createMockFile({ mimetype: 'application/pdf' });
      const result = validateFile(file, {
        allowedMimeTypes: ['image/jpeg', 'image/png'],
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('not allowed');
    });

    it('should validate file extension when allowed extensions specified', () => {
      const file = createMockFile({ originalname: 'test.jpg' });
      const result = validateFile(file, {
        allowedExtensions: ['jpg', 'png', 'gif'],
      });

      expect(result.valid).toBe(true);
    });

    it('should reject file with invalid extension', () => {
      const file = createMockFile({ originalname: 'test.exe' });
      const result = validateFile(file, {
        allowedExtensions: ['jpg', 'png', 'gif'],
      });

      expect(result.valid).toBe(false);
      expect(result.error).toContain('extension not allowed');
    });
  });

  describe('validateImage', () => {
    it('should validate valid image file', () => {
      const file = createMockFile({
        mimetype: 'image/jpeg',
        size: 1024 * 1024, // 1MB
      });

      const result = validateImage(file);

      expect(result.valid).toBe(true);
    });

    it('should reject image exceeding 10MB', () => {
      const file = createMockFile({
        mimetype: 'image/jpeg',
        size: 11 * 1024 * 1024, // 11MB
      });

      const result = validateImage(file);

      expect(result.valid).toBe(false);
    });

    it('should reject non-image MIME type', () => {
      const file = createMockFile({
        mimetype: 'application/pdf',
      });

      const result = validateImage(file);

      expect(result.valid).toBe(false);
    });
  });

  describe('validateVideo', () => {
    it('should validate valid video file', () => {
      const file = createMockFile({
        mimetype: 'video/mp4',
        size: 50 * 1024 * 1024, // 50MB
      });

      const result = validateVideo(file);

      expect(result.valid).toBe(true);
    });

    it('should reject video exceeding 100MB', () => {
      const file = createMockFile({
        mimetype: 'video/mp4',
        size: 101 * 1024 * 1024, // 101MB
      });

      const result = validateVideo(file);

      expect(result.valid).toBe(false);
    });
  });

  describe('validateDocument', () => {
    it('should validate valid document file', () => {
      const file = createMockFile({
        mimetype: 'application/pdf',
        size: 2 * 1024 * 1024, // 2MB
      });

      const result = validateDocument(file);

      expect(result.valid).toBe(true);
    });

    it('should reject document exceeding 5MB', () => {
      const file = createMockFile({
        mimetype: 'application/pdf',
        size: 6 * 1024 * 1024, // 6MB
      });

      const result = validateDocument(file);

      expect(result.valid).toBe(false);
    });
  });

  describe('getFileExtension', () => {
    it('should extract file extension', () => {
      expect(getFileExtension('test.jpg')).toBe('jpg');
      expect(getFileExtension('document.pdf')).toBe('pdf');
      expect(getFileExtension('image.PNG')).toBe('png');
    });

    it('should return empty string for files without extension', () => {
      expect(getFileExtension('test')).toBe('');
    });
  });

  describe('generateUniqueFilename', () => {
    it('should generate unique filename', () => {
      const filename = generateUniqueFilename('test.jpg');

      expect(filename).toContain('test');
      expect(filename).toContain('.jpg');
      expect(filename).not.toBe('test.jpg');
    });

    it('should include prefix when provided', () => {
      const filename = generateUniqueFilename('test.jpg', 'prefix');

      expect(filename).toContain('prefix');
    });

    it('should sanitize filename', () => {
      const filename = generateUniqueFilename('test file name.jpg');

      expect(filename).not.toContain(' ');
      expect(filename).toContain('-');
    });
  });

  describe('isImage', () => {
    it('should return true for image MIME types', () => {
      expect(isImage('image/jpeg')).toBe(true);
      expect(isImage('image/png')).toBe(true);
      expect(isImage('image/gif')).toBe(true);
    });

    it('should return false for non-image MIME types', () => {
      expect(isImage('application/pdf')).toBe(false);
      expect(isImage('video/mp4')).toBe(false);
    });
  });

  describe('isVideo', () => {
    it('should return true for video MIME types', () => {
      expect(isVideo('video/mp4')).toBe(true);
      expect(isVideo('video/webm')).toBe(true);
    });

    it('should return false for non-video MIME types', () => {
      expect(isVideo('image/jpeg')).toBe(false);
      expect(isVideo('application/pdf')).toBe(false);
    });
  });
});

