import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export default async function handler(req: any, res: any) {
  const { method } = req;

  try {
    switch (method) {
      case 'GET': {
        // Get page content by pageKey
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
            pageKey,
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
      }

      case 'POST': {
        // Create or update page content
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
      }

      case 'PUT': {
        // Update multiple page contents at once
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
      }

      case 'DELETE': {
        // Delete page content
        const { pageKey, section, contentKey } = req.query;
        
        if (!pageKey || !section || !contentKey) {
          return res.status(400).json({ error: 'Missing required fields' });
        }
        
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
      }

      default:
        res.setHeader('Allow', ['GET', 'POST', 'PUT', 'DELETE']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  } catch (error) {
    console.error('Error in page-content API:', error);
    res.status(500).json({ error: 'Internal server error' });
  } finally {
    await prisma.$disconnect();
  }
}
