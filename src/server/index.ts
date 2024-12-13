import express from 'express';
import prisma from './db';

const app = express();

app.use(express.json());

// Framework routes
app.get('/api/frameworks', async (req, res) => {
  try {
    const frameworks = await prisma.framework.findMany({
      include: {
        eligibilityCriteria: {
          include: {
            attributes: true
          }
        },
        attributes: true
      }
    });
    res.json(frameworks);
  } catch (error) {
    console.error('Error fetching frameworks:', error);
    res.status(500).json({ error: 'Failed to fetch frameworks' });
  }
});

app.post('/api/frameworks', async (req, res) => {
  try {
    const framework = await prisma.framework.create({
      data: {
        ...req.body,
        eligibilityCriteria: req.body.eligibilityCriteria ? {
          create: {
            ...req.body.eligibilityCriteria,
            attributes: {
              create: req.body.eligibilityCriteria.attributes || []
            }
          }
        } : undefined,
        attributes: {
          create: req.body.attributes || []
        }
      },
      include: {
        eligibilityCriteria: {
          include: {
            attributes: true
          }
        },
        attributes: true
      }
    });
    res.json(framework);
  } catch (error) {
    console.error('Error creating framework:', error);
    res.status(500).json({ error: 'Failed to create framework' });
  }
});

app.put('/api/frameworks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const framework = await prisma.framework.update({
      where: { id },
      data: {
        ...req.body,
        eligibilityCriteria: req.body.eligibilityCriteria ? {
          upsert: {
            create: {
              ...req.body.eligibilityCriteria,
              attributes: {
                create: req.body.eligibilityCriteria.attributes || []
              }
            },
            update: {
              ...req.body.eligibilityCriteria,
              attributes: {
                deleteMany: {},
                create: req.body.eligibilityCriteria.attributes || []
              }
            }
          }
        } : undefined,
        attributes: {
          deleteMany: {},
          create: req.body.attributes || []
        }
      },
      include: {
        eligibilityCriteria: {
          include: {
            attributes: true
          }
        },
        attributes: true
      }
    });
    res.json(framework);
  } catch (error) {
    console.error('Error updating framework:', error);
    res.status(500).json({ error: 'Failed to update framework' });
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});