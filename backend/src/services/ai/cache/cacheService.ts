import { createHash } from 'crypto';
import { Role, Analysis } from '../../../types';

interface CacheEntry {
  data: Analysis;
  timestamp: number;
}

/**
 * In-memory cache service for AI responses
 * Reduces OpenAI API calls and costs by caching recent analyses
 */
class AICache {
  private cache: Map<string, CacheEntry> = new Map();
  private readonly maxSize: number = 100; // Maximum number of cached items
  private readonly ttl: number = 24 * 60 * 60 * 1000; // 24 hours in milliseconds

  /**
   * Generate a cache key from resume text and target role
   * Uses SHA256 hash for consistent key generation
   */
  generateKey(resumeText: string, targetRole: Role): string {
    const hash = createHash('sha256')
      .update(`${resumeText}:${targetRole}`)
      .digest('hex');
    return `analysis:${hash}`;
  }

  /**
   * Get cached analysis if it exists and hasn't expired
   */
  get(key: string): Analysis | null {
    const entry = this.cache.get(key);

    if (!entry) {
      return null;
    }

    // Check if entry has expired
    const now = Date.now();
    if (now - entry.timestamp > this.ttl) {
      this.cache.delete(key);
      return null;
    }

    return entry.data;
  }

  /**
   * Store analysis in cache
   * Implements LRU (Least Recently Used) eviction when cache is full
   */
  set(key: string, data: Analysis): void {
    // If cache is at max capacity, remove oldest entry
    if (this.cache.size >= this.maxSize) {
      const firstKey = this.cache.keys().next().value;
      if (firstKey) {
        this.cache.delete(firstKey);
      }
    }

    this.cache.set(key, {
      data,
      timestamp: Date.now(),
    });
  }

  /**
   * Clear all cached entries
   */
  clear(): void {
    this.cache.clear();
  }

  /**
   * Get cache statistics
   */
  getStats(): { size: number; maxSize: number; ttlHours: number } {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      ttlHours: this.ttl / (60 * 60 * 1000),
    };
  }
}

// Export singleton instance
export const aiCache = new AICache();
