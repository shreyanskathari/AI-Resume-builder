import express from 'express';
import { db } from '../db.js';
import { authMiddleware } from '../middleware/auth.js';

const router = express.Router();
router.use(authMiddleware);

// Get all applications
router.get('/', (req, res) => {
  const list = db.getApplicationsByUser(req.user.id);
  res.json({ applications: list });
});

// Create application
router.post('/', (req, res) => {
  const { company, position, status, appliedDate, salary, notes, url } = req.body;
  if (!company || !position) {
    return res.status(400).json({ error: 'Company and Position are required' });
  }

  const app = db.createApplication({
    userId: req.user.id,
    company: company.trim(),
    position: position.trim(),
    status: status || 'Applied',
    appliedDate: appliedDate || new Date().toISOString().split('T')[0],
    salary: salary || '',
    notes: notes || '',
    url: url || ''
  });

  res.status(201).json({ message: 'Application tracked successfully', application: app });
});

// Update application
router.put('/:id', (req, res) => {
  const updated = db.updateApplication(req.params.id, req.user.id, req.body);
  if (!updated) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json({ message: 'Application updated', application: updated });
});

// Delete application
router.delete('/:id', (req, res) => {
  const success = db.deleteApplication(req.params.id, req.user.id);
  if (!success) {
    return res.status(404).json({ error: 'Application not found' });
  }
  res.json({ message: 'Application deleted' });
});

export default router;
