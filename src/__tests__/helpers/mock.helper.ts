/**
 * Mock Redis client for testing
 */
export const mockRedis = {
  get: jest.fn(),
  set: jest.fn(),
  del: jest.fn(),
  keys: jest.fn(),
  isOpen: true,
  connect: jest.fn().mockResolvedValue(undefined),
  disconnect: jest.fn().mockResolvedValue(undefined),
};

/**
 * Mock Cloudflare R2 service
 */
export const mockR2Service = {
  uploadFile: jest.fn(),
  deleteFile: jest.fn(),
  getFileUrl: jest.fn(),
};

/**
 * Mock Cloudflare Images service
 */
export const mockImagesService = {
  uploadImage: jest.fn(),
  getImageUrl: jest.fn(),
  deleteImage: jest.fn(),
};

/**
 * Mock logger
 */
export const mockLogger = {
  info: jest.fn(),
  error: jest.fn(),
  warn: jest.fn(),
  debug: jest.fn(),
};

/**
 * Reset all mocks
 */
export function resetAllMocks() {
  mockRedis.get.mockReset();
  mockRedis.set.mockReset();
  mockRedis.del.mockReset();
  mockRedis.keys.mockReset();
  mockR2Service.uploadFile.mockReset();
  mockR2Service.deleteFile.mockReset();
  mockR2Service.getFileUrl.mockReset();
  mockImagesService.uploadImage.mockReset();
  mockImagesService.getImageUrl.mockReset();
  mockImagesService.deleteImage.mockReset();
  mockLogger.info.mockReset();
  mockLogger.error.mockReset();
  mockLogger.warn.mockReset();
  mockLogger.debug.mockReset();
}

