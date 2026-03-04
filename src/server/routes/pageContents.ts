import { Router } from 'express';
import prisma from '../utils/prisma';

const router = Router();

// GET - Fetch page content(s)
router.get('/', async (req, res) => {
  try {
    const { pageKey } = req.query;
    
    if (!pageKey) {
      // Get all page content grouped by pageKey
      const contents = await prisma.pageContent.findMany({
        where: { isPublic: true },
        orderBy: [{ pageKey: 'asc' }, { section: 'asc' }]
      });
      
      // Group by pageKey and section
      const grouped = contents.reduce((acc: any, item: any) => {
        if (!acc[item.pageKey]) acc[item.pageKey] = {};
        if (!acc[item.pageKey][item.section]) acc[item.pageKey][item.section] = {};
        acc[item.pageKey][item.section][item.contentKey] = {
          value: item.contentValue,
          metadata: item.metadata
        };
        return acc;
      }, {});
      
      return res.json(grouped);
    }
    
    // Get content for specific page
    const contents = await prisma.pageContent.findMany({
      where: { 
        pageKey: pageKey as string,
        isPublic: true
      },
      orderBy: { section: 'asc' }
    });
    
    // Group by section
    const grouped = contents.reduce((acc: any, item: any) => {
      if (!acc[item.section]) acc[item.section] = {};
      acc[item.section][item.contentKey] = {
        value: item.contentValue,
        metadata: item.metadata
      };
      return acc;
    }, {});
    
    return res.json(grouped);
  } catch (error) {
    console.error('Error fetching page content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// POST - Create or update a single page content entry
router.post('/', async (req, res) => {
  try {
    const { pageKey, section, contentKey, contentValue, metadata, isPublic } = req.body;
    
    if (!pageKey || !section || !contentKey || contentValue === undefined) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    
    const content = await prisma.pageContent.upsert({
      where: {
        pageKey_section_contentKey: {
          pageKey,
          section,
          contentKey
        }
      },
      update: {
        contentValue,
        metadata,
        isPublic: isPublic !== undefined ? isPublic : true
      },
      create: {
        pageKey,
        section,
        contentKey,
        contentValue,
        metadata,
        isPublic: isPublic !== undefined ? isPublic : true
      }
    });
    
    return res.json(content);
  } catch (error) {
    console.error('Error saving page content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT - Update multiple page contents at once
router.put('/', async (req, res) => {
  try {
    const { updates } = req.body;
    
    if (!updates || !Array.isArray(updates)) {
      return res.status(400).json({ error: 'Updates array required' });
    }
    
    const results = await Promise.all(
      updates.map(async (update: any) => {
        const { pageKey, section, contentKey, contentValue, metadata, isPublic } = update;
        
        if (!pageKey || !section || !contentKey || contentValue === undefined) {
          throw new Error('Missing required fields in update');
        }
        
        return prisma.pageContent.upsert({
          where: {
            pageKey_section_contentKey: {
              pageKey,
              section,
              contentKey
            }
          },
          update: {
            contentValue,
            metadata,
            isPublic: isPublic !== undefined ? isPublic : true
          },
          create: {
            pageKey,
            section,
            contentKey,
            contentValue,
            metadata,
            isPublic: isPublic !== undefined ? isPublic : true
          }
        });
      })
    );
    
    return res.json({ success: true, count: results.length });
  } catch (error) {
    console.error('Error updating page contents:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// DELETE - Delete page content
router.delete('/:pageKey/:section/:contentKey', async (req, res) => {
  try {
    const { pageKey, section, contentKey } = req.params;
    
    await prisma.pageContent.delete({
      where: {
        pageKey_section_contentKey: {
          pageKey,
          section,
          contentKey
        }
      }
    });
    
    return res.json({ success: true });
  } catch (error) {
    console.error('Error deleting page content:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
