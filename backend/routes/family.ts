import { createClient } from '@supabase/supabase-js';
import express from 'express';
import { authenticateToken } from '../src/middleware/auth';

const router = express.Router();
const supabase = createClient(
  process.env.SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE || '',
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  }
);

// Get all family members for the authenticated user
router.get('/', authenticateToken, async (req, res) => {
  try {
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const { data, error } = await supabase
      .from('family_members')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: true });

    if (error) throw error;
    res.json(data || []);
  } catch (error: any) {
    console.error('Error fetching family members:', error);
    res.status(500).json({ error: error?.message || 'Failed to fetch family members' });
  }
});

// Create a new family member
router.post('/', authenticateToken, async (req, res) => {
  try {
    const { name, relationship, pan, aadhar, profession, marital_status, dob } = req.body as any;

    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    // Prevent duplicate names per user (case-insensitive)
    if (typeof name === 'string' && name.trim().length > 0) {
      const { data: existingByName, error: nameCheckError } = await supabase
        .from('family_members')
        .select('id')
        .eq('user_id', user_id)
        .ilike('name', name.trim());
      if (nameCheckError) throw nameCheckError;
      if (existingByName && existingByName.length > 0) {
        return res.status(409).json({ error: 'A family member with this name already exists.' });
      }
    }

    const insertPayload: any = { name, relationship, user_id };
    if (pan !== undefined) insertPayload.pan = pan;
    if (aadhar !== undefined) insertPayload.aadhar = aadhar;
    if (profession !== undefined) insertPayload.profession = profession;
    if (marital_status !== undefined) insertPayload.marital_status = marital_status;
    if (dob !== undefined) insertPayload.dob = dob;

    const { data, error } = await supabase
      .from('family_members')
      .insert([insertPayload])
      .select()
      .single();

    if (error) throw error;

    res.status(201).json(data);
  } catch (error: any) {
    console.error('Error creating family member:', error);
    res.status(500).json({ error: 'Failed to create family member' });
  }
});

// Update a family member
router.put('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const { user_id: _ignored, name, relationship, pan, aadhar, profession, marital_status, dob } = req.body as any;
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    // Prevent duplicate names per user when renaming (case-insensitive)
    if (typeof name === 'string' && name.trim().length > 0) {
      const { data: existingByName, error: nameCheckError } = await supabase
        .from('family_members')
        .select('id')
        .eq('user_id', user_id)
        .ilike('name', name.trim());
      if (nameCheckError) throw nameCheckError;
      if (existingByName && existingByName.some((row: any) => row.id !== id)) {
        return res.status(409).json({ error: 'A family member with this name already exists.' });
      }
    }

    const updatePayload: any = {};
    if (name !== undefined) updatePayload.name = name;
    if (relationship !== undefined) updatePayload.relationship = relationship;
    if (pan !== undefined) updatePayload.pan = pan;
    if (aadhar !== undefined) updatePayload.aadhar = aadhar;
    if (profession !== undefined) updatePayload.profession = profession;
    if (marital_status !== undefined) updatePayload.marital_status = marital_status;
    if (dob !== undefined) updatePayload.dob = dob;
    const { data, error } = await supabase
      .from('family_members')
      .update(updatePayload)
      .eq('id', id)
      .eq('user_id', user_id)
      .select()
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ error: 'Family member not found' });
    }

    res.json(data);
  } catch (error: any) {
    console.error('Error updating family member:', error);
    res.status(500).json({ error: 'Failed to update family member' });
  }
});

// Delete a family member
router.delete('/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = req.user?.id;
    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    const { error } = await supabase
      .from('family_members')
      .delete()
      .eq('id', id)
      .eq('user_id', user_id);

    if (error) throw error;

    res.status(204).send();
  } catch (error: any) {
    console.error('Error deleting family member:', error);
    res.status(500).json({ error: 'Failed to delete family member' });
  }
});

export default router;
