// src/server/api/example-plans.ts
import fs from 'fs';
import path from 'path';
import { Router } from 'express';

const router = Router();

router.get('/', (req, res) => {
  try {
    const plansDir = path.join(process.cwd(), 'public', 'example-plans');
    
    // Check if directory exists
    if (!fs.existsSync(plansDir)) {
      // Create directory if it doesn't exist
      fs.mkdirSync(plansDir, { recursive: true });
      console.log(`Created directory: ${plansDir}`);
    }
    
    // Read directory
    const files = fs.readdirSync(plansDir)
      .filter(file => /\.(png|jpe?g)$/i.test(file)); // Only PNG and JPG files
    
    console.log('Found example plan files:', files); // Debug log
    
    res.json({ 
      plans: files,
      directory: plansDir // Include for debugging
    });
  } catch (error) {
    console.error('Error in /api/example-plans:', error);
    res.status(500).json({ 
      error: 'Failed to read example plans directory',
      details: error instanceof Error ? error.message : String(error),
      directory: process.cwd() // Include for debugging
    });
  }
});

// Export for use in main router
export default router;