import express from 'express';
import { dbService, getSupabase, isSupabaseConfigured } from './db.js';

export const apiRouter = express.Router();

// Helper token generator / parser for demo/dev sessions
function parseAuthToken(req) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  if (req.cookies && req.cookies.ca_session_token) {
    return req.cookies.ca_session_token;
  }
  return null;
}

// -----------------------------------------------------------------------------
// Authentication & Role-Based Access Control (RBAC) Middleware
// -----------------------------------------------------------------------------

export async function authMiddleware(req, res, next) {
  const token = parseAuthToken(req);
  if (!token) {
    req.user = null;
    return next();
  }

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { data: { user }, error } = await supabase.auth.getUser(token);
      if (user && !error) {
        // Fetch verified profile from database to enforce server-authoritative role
        const profile = await dbService.getProfileById(user.id);
        req.user = {
          id: user.id,
          email: user.email,
          role: profile?.role || 'user',
          profile
        };
        return next();
      }
    } catch (e) {
      console.warn('[Auth Middleware] Supabase token verification failed:', e.message);
    }
  }

  // Fallback token decoding (base64 token payload or mock session)
  try {
    const decoded = JSON.parse(Buffer.from(token, 'base64').toString('utf8'));
    if (decoded && decoded.email) {
      const profile = await dbService.getProfileByEmail(decoded.email);
      req.user = {
        id: profile?.id || decoded.id || 'usr-' + decoded.email,
        email: decoded.email,
        role: profile?.role || (decoded.email.toLowerCase().includes('admin') ? 'admin' : 'user'),
        profile
      };
      return next();
    }
  } catch (e) {
    // Malformed token
  }

  req.user = null;
  next();
}

export function requireAuth(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required. Please sign in to continue.' });
  }
  next();
}

export function requireAdmin(req, res, next) {
  if (!req.user) {
    return res.status(401).json({ error: 'Authentication required.' });
  }
  if (req.user.role !== 'admin') {
    return res.status(403).json({ error: 'Access denied. Administrator privilege required.' });
  }
  next();
}

// -----------------------------------------------------------------------------
// PUBLIC CONFIGURATION & HEALTH
// -----------------------------------------------------------------------------

apiRouter.get('/config', (req, res) => {
  res.json({
    supabaseConfigured: isSupabaseConfigured(),
    supabaseUrl: process.env.SUPABASE_URL || null,
    environment: process.env.NODE_ENV || 'development'
  });
});

// -----------------------------------------------------------------------------
// AUTHENTICATION API ROUTES (Supabase Auth + Database Profile Sync)
// -----------------------------------------------------------------------------

// SIGN UP
apiRouter.post('/auth/register', async (req, res) => {
  try {
    const { email, password, fullName, phone } = req.body;

    // Strict validation
    if (!email || !email.includes('@') || !email.includes('.')) {
      return res.status(400).json({ error: 'Please provide a valid email address.' });
    }
    if (!password || password.length < 6) {
      return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
    }

    const cleanEmail = email.trim().toLowerCase();
    const cleanName = (fullName || cleanEmail.split('@')[0]).trim();
    const assignedRole = cleanEmail.includes('admin') ? 'admin' : 'user';

    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            phone: phone || ''
          }
        }
      });
      if (error) {
        return res.status(400).json({ error: error.message });
      }

      // Ensure profile exists in database
      const profile = await dbService.saveProfile({
        id: data.user?.id || 'usr-' + Date.now(),
        email: cleanEmail,
        full_name: cleanName,
        role: assignedRole,
        explored_ids: ['python'],
        selected_path: 'AI & Machine Learning',
        quiz_attempts: 0,
        best_score: '—',
        last_activity: 'Account Registered'
      });

      await dbService.logActivity(cleanEmail, 'Registered new developer account', 'Auth');

      const token = data.session?.access_token || Buffer.from(JSON.stringify({ email: cleanEmail, id: profile.id, role: profile.role, ts: Date.now() })).toString('base64');
      return res.status(201).json({
        message: 'Account created successfully.',
        user: { id: profile.id, email: cleanEmail, role: profile.role, fullName: profile.full_name },
        token,
        profile
      });
    }

    // Local / Development Database Registration
    const existing = await dbService.getProfileByEmail(cleanEmail);
    if (existing) {
      return res.status(400).json({ error: 'An account with this email already exists. Please sign in instead.' });
    }

    const newProfile = await dbService.saveProfile({
      id: 'usr-' + Date.now(),
      email: cleanEmail,
      full_name: cleanName,
      role: assignedRole,
      explored_ids: ['python'],
      selected_path: 'AI & Machine Learning',
      quiz_attempts: 0,
      best_score: '—',
      last_activity: 'Account Registered'
    });

    await dbService.logActivity(cleanEmail, 'Registered new developer account', 'Auth');

    const token = Buffer.from(JSON.stringify({ email: cleanEmail, id: newProfile.id, role: newProfile.role, ts: Date.now() })).toString('base64');
    res.status(201).json({
      message: 'Account created successfully.',
      user: { id: newProfile.id, email: cleanEmail, role: newProfile.role, fullName: newProfile.full_name },
      token,
      profile: newProfile
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
});

// LOGIN
apiRouter.post('/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !email.includes('@')) {
      return res.status(400).json({ error: 'Please enter a valid email address.' });
    }
    if (!password) {
      return res.status(400).json({ error: 'Please enter your password.' });
    }

    const cleanEmail = email.trim().toLowerCase();

    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) {
        return res.status(401).json({ error: error.message });
      }

      let profile = await dbService.getProfileById(data.user.id);
      if (!profile) {
        profile = await dbService.saveProfile({
          id: data.user.id,
          email: cleanEmail,
          full_name: cleanEmail.split('@')[0],
          role: cleanEmail.includes('admin') ? 'admin' : 'user',
          explored_ids: ['python']
        });
      }

      await dbService.logActivity(cleanEmail, 'Signed in to CodeAtlas', 'Auth');

      return res.json({
        message: 'Authentication successful.',
        user: { id: profile.id, email: cleanEmail, role: profile.role, fullName: profile.full_name },
        token: data.session.access_token,
        profile
      });
    }

    // Local / Demo Database Login
    let profile = await dbService.getProfileByEmail(cleanEmail);
    if (!profile) {
      // Auto-provision profile for valid sign in demo
      const assignedRole = cleanEmail.includes('admin') ? 'admin' : 'user';
      profile = await dbService.saveProfile({
        id: 'usr-' + Date.now(),
        email: cleanEmail,
        full_name: cleanEmail.split('@')[0],
        role: assignedRole,
        explored_ids: ['python'],
        selected_path: 'AI & Machine Learning'
      });
    }

    const token = Buffer.from(JSON.stringify({ email: cleanEmail, id: profile.id, role: profile.role, ts: Date.now() })).toString('base64');
    await dbService.logActivity(cleanEmail, 'Signed in to CodeAtlas', 'Auth');

    res.json({
      message: 'Authentication successful.',
      user: { id: profile.id, email: cleanEmail, role: profile.role, fullName: profile.full_name },
      token,
      profile
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal authentication failure.' });
  }
});

// LOGOUT
apiRouter.post('/auth/logout', requireAuth, async (req, res) => {
  const supabase = getSupabase();
  if (supabase) {
    try {
      await supabase.auth.signOut();
    } catch (e) {}
  }
  await dbService.logActivity(req.user.email, 'Signed out of session', 'Auth');
  res.json({ message: 'Signed out successfully.' });
});

// GET CURRENT USER / VERIFY SESSION
apiRouter.get('/auth/me', requireAuth, async (req, res) => {
  const profile = await dbService.getProfileByEmail(req.user.email) || req.user.profile;
  res.json({
    user: {
      id: req.user.id,
      email: req.user.email,
      role: profile?.role || req.user.role,
      fullName: profile?.full_name || ''
    },
    profile
  });
});

// PASSWORD RESET REQUEST
apiRouter.post('/auth/reset-password', async (req, res) => {
  const { email } = req.body;
  if (!email || !email.includes('@')) {
    return res.status(400).json({ error: 'Please enter a valid email address.' });
  }
  const cleanEmail = email.trim().toLowerCase();

  const supabase = getSupabase();
  if (supabase) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(cleanEmail, {
        redirectTo: `${req.protocol}://${req.get('host')}/login.html?view=reset`
      });
      if (error) return res.status(400).json({ error: error.message });
    } catch (e) {
      console.warn('[Supabase] reset password error:', e.message);
    }
  }

  await dbService.logActivity(cleanEmail, 'Requested password reset dispatch', 'Auth');
  res.json({ message: `If an account exists for ${cleanEmail}, a secure password reset link has been dispatched.` });
});

// -----------------------------------------------------------------------------
// USER PROFILE ROUTES
// -----------------------------------------------------------------------------

apiRouter.get('/profile', requireAuth, async (req, res) => {
  const profile = await dbService.getProfileByEmail(req.user.email);
  if (!profile) {
    return res.status(404).json({ error: 'Profile record not found.' });
  }
  res.json({ profile });
});

apiRouter.put('/profile', requireAuth, async (req, res) => {
  try {
    const existing = await dbService.getProfileByEmail(req.user.email);
    if (!existing) return res.status(404).json({ error: 'Profile not found' });

    const { full_name, selected_path, explored_ids, quiz_attempts, best_score, last_activity } = req.body;

    // Normal users cannot elevate their own role
    const updates = {
      ...existing,
      full_name: full_name !== undefined ? String(full_name).trim() : existing.full_name,
      selected_path: selected_path || existing.selected_path,
      explored_ids: Array.isArray(explored_ids) ? explored_ids : existing.explored_ids,
      quiz_attempts: typeof quiz_attempts === 'number' ? quiz_attempts : existing.quiz_attempts,
      best_score: best_score || existing.best_score,
      last_activity: last_activity || existing.last_activity
    };

    const saved = await dbService.saveProfile(updates);
    res.json({ profile: saved, message: 'Profile updated successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update profile.' });
  }
});

// Record language explored by current user
apiRouter.post('/profile/explore', requireAuth, async (req, res) => {
  const { langId, langName } = req.body;
  if (!langId) return res.status(400).json({ error: 'Language ID required.' });

  const profile = await dbService.getProfileByEmail(req.user.email);
  if (profile) {
    const ids = new Set(profile.explored_ids || []);
    ids.add(langId);
    profile.explored_ids = Array.from(ids);
    profile.last_activity = `Explored ${langName || langId}`;
    await dbService.saveProfile(profile);
  }

  await dbService.logActivity(req.user.email, `Explored ${langName || langId}`, 'Language');
  res.json({ success: true, explored: profile?.explored_ids || [] });
});

// Record quiz completion
apiRouter.post('/profile/quiz-result', requireAuth, async (req, res) => {
  const { score, total } = req.body;
  const numScore = parseInt(score, 10) || 0;
  const numTotal = parseInt(total, 10) || 5;

  const profile = await dbService.getProfileByEmail(req.user.email);
  if (profile) {
    profile.quiz_attempts = (profile.quiz_attempts || 0) + 1;
    profile.best_score = `${numScore} / ${numTotal} (${Math.round((numScore / numTotal) * 100)}%)`;
    profile.last_activity = `Completed Architecture Quiz (${numScore}/${numTotal})`;
    await dbService.saveProfile(profile);
  }

  await dbService.logActivity(req.user.email, `Completed Architecture Quiz (${numScore}/${numTotal})`, 'Quiz');
  res.json({ success: true, profile });
});

// -----------------------------------------------------------------------------
// LANGUAGES CRUD (Public Read, Admin Write)
// -----------------------------------------------------------------------------

apiRouter.get('/languages', async (req, res) => {
  try {
    const { category, search } = req.query;
    const langs = await dbService.getLanguages(category, search);
    res.json({ languages: langs });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch languages.' });
  }
});

apiRouter.get('/languages/:id', async (req, res) => {
  try {
    const lang = await dbService.getLanguageById(req.params.id);
    if (!lang) {
      return res.status(404).json({ error: `Language '${req.params.id}' not found.` });
    }
    res.json({ language: lang });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch language.' });
  }
});

// CREATE LANGUAGE (ADMIN ONLY)
apiRouter.post('/languages', requireAdmin, async (req, res) => {
  try {
    const { id, name, mark, year, category, paradigm, typing, execution, uses, creator, description, ecosystem, learning_considerations, syntax, related, coords, featured } = req.body;

    if (!id || !name || !category || !description) {
      return res.status(400).json({ error: 'Missing required fields: id, name, category, and description are mandatory.' });
    }

    const cleanId = String(id).toLowerCase().replace(/[^a-z0-9_-]/g, '');

    const record = {
      id: cleanId,
      name: String(name).trim(),
      mark: mark ? String(mark).trim() : name.substring(0, 3),
      year: parseInt(year, 10) || new Date().getFullYear(),
      category: String(category).trim(),
      paradigm: paradigm || 'Multi-paradigm',
      typing: typing || 'Static, Strong',
      execution: execution || 'Ahead-of-Time Compiled',
      uses: Array.isArray(uses) ? uses : (uses ? String(uses).split(',').map(s => s.trim()) : ['General Purpose Computing']),
      creator: creator || 'Open Source Community',
      description: String(description).trim(),
      ecosystem: Array.isArray(ecosystem) ? ecosystem : (ecosystem ? String(ecosystem).split(',').map(s => s.trim()) : ['Standard Tooling']),
      learning_considerations: learning_considerations || 'Disciplined conceptual model with rich package ecosystem.',
      syntax: syntax || `// CodeAtlas ${name} sample syntax\nconsole.log("Telemetry online");`,
      related: Array.isArray(related) ? related : ['c', 'python'],
      featured: Boolean(featured),
      coords: coords || { x: 0, y: 0, z: 0 }
    };

    const created = await dbService.createLanguage(record);
    await dbService.logActivity(req.user.email, `Created language dossier: ${record.name} (${record.id})`, 'Admin');

    res.status(201).json({ language: created, message: `Language ${record.name} added successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create language.' });
  }
});

// UPDATE LANGUAGE (ADMIN ONLY)
apiRouter.put('/languages/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbService.getLanguageById(id);
    if (!existing) {
      return res.status(404).json({ error: `Language '${id}' not found.` });
    }

    const updated = await dbService.updateLanguage(id, req.body);
    await dbService.logActivity(req.user.email, `Updated language dossier: ${existing.name}`, 'Admin');

    res.json({ language: updated, message: `Language '${existing.name}' updated successfully.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update language.' });
  }
});

// DELETE LANGUAGE (ADMIN ONLY)
apiRouter.delete('/languages/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    const existing = await dbService.getLanguageById(id);
    if (!existing) {
      return res.status(404).json({ error: `Language '${id}' not found.` });
    }

    await dbService.deleteLanguage(id);
    await dbService.logActivity(req.user.email, `Deleted language dossier: ${existing.name} (${id})`, 'Admin');

    res.json({ success: true, message: `Language '${existing.name}' removed from database.` });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete language.' });
  }
});

// -----------------------------------------------------------------------------
// TIMELINE & LEARNING PATHS (Public Read)
// -----------------------------------------------------------------------------

apiRouter.get('/timeline', async (req, res) => {
  try {
    const timeline = await dbService.getTimeline();
    res.json({ timeline });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch timeline events.' });
  }
});

apiRouter.get('/paths', async (req, res) => {
  try {
    const paths = await dbService.getLearningPaths();
    res.json({ paths });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch learning paths.' });
  }
});

// -----------------------------------------------------------------------------
// QUIZ CONTENT CRUD (Public Read, Admin Write)
// -----------------------------------------------------------------------------

apiRouter.get('/quiz', async (req, res) => {
  try {
    const questions = await dbService.getQuizQuestions();
    res.json({ questions });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch quiz content.' });
  }
});

apiRouter.post('/quiz', requireAdmin, async (req, res) => {
  try {
    const { question, options, correct_index, explanation } = req.body;
    if (!question || !Array.isArray(options) || options.length < 2) {
      return res.status(400).json({ error: 'Question prompt and at least 2 options are required.' });
    }

    const newQ = {
      id: 'q-' + Date.now(),
      question: String(question).trim(),
      options,
      correct_index: parseInt(correct_index, 10) || 0,
      explanation: explanation ? String(explanation).trim() : 'Verified by CodeAtlas architectural telemetry.'
    };

    const created = await dbService.createQuizQuestion(newQ);
    await dbService.logActivity(req.user.email, `Added new quiz question: "${newQ.question.substring(0, 36)}..."`, 'Admin');

    res.status(201).json({ question: created, message: 'Quiz question added.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to create quiz question.' });
  }
});

apiRouter.delete('/quiz/:id', requireAdmin, async (req, res) => {
  try {
    const { id } = req.params;
    await dbService.deleteQuizQuestion(id);
    await dbService.logActivity(req.user.email, `Deleted quiz question ID: ${id}`, 'Admin');
    res.json({ success: true, message: 'Quiz question removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete quiz question.' });
  }
});

// -----------------------------------------------------------------------------
// ACTIVITY LOGS
// -----------------------------------------------------------------------------

apiRouter.get('/activity', requireAdmin, async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 30;
    const activities = await dbService.getActivities(limit);
    res.json({ activities });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch activity stream.' });
  }
});

apiRouter.post('/activity', async (req, res) => {
  try {
    const { action, type } = req.body;
    const userEmail = req.user?.email || req.body.userEmail || 'guest@codeatlas.dev';
    if (!action) return res.status(400).json({ error: 'Action is required.' });

    const entry = await dbService.logActivity(userEmail, action, type || 'Telemetry');
    res.status(201).json({ activity: entry });
  } catch (err) {
    res.status(500).json({ error: 'Failed to record activity log.' });
  }
});

// -----------------------------------------------------------------------------
// ADMIN DASHBOARD STATISTICS & USER MANAGEMENT
// -----------------------------------------------------------------------------

apiRouter.get('/admin/stats', requireAdmin, async (req, res) => {
  try {
    const stats = await dbService.getAdminStats();
    res.json({ stats });
  } catch (err) {
    res.status(500).json({ error: 'Failed to compute admin statistics.' });
  }
});

apiRouter.get('/admin/users', requireAdmin, async (req, res) => {
  try {
    const profiles = await dbService.getAllProfiles();
    res.json({ users: profiles });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch user list.' });
  }
});

apiRouter.put('/admin/users/:id/role', requireAdmin, async (req, res) => {
  try {
    const { role } = req.body;
    const updated = await dbService.updateUserRole(req.params.id, role);
    if (!updated) return res.status(404).json({ error: 'User profile not found.' });

    await dbService.logActivity(req.user.email, `Changed role of user ${updated.email} to '${role}'`, 'Admin');
    res.json({ user: updated, message: `User role updated to ${role}.` });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Failed to update user role.' });
  }
});

apiRouter.delete('/admin/users/:id', requireAdmin, async (req, res) => {
  try {
    if (req.user.id === req.params.id) {
      return res.status(400).json({ error: 'Cannot delete your own administrator account.' });
    }
    await dbService.deleteUserProfile(req.params.id);
    await dbService.logActivity(req.user.email, `Removed user profile ID: ${req.params.id}`, 'Admin');
    res.json({ success: true, message: 'User account removed.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete user.' });
  }
});

apiRouter.post('/admin/reset-dataset', requireAdmin, async (req, res) => {
  try {
    await dbService.resetDefaultDataset();
    res.json({ success: true, message: 'Database reset to factory default dataset.' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to reset dataset.' });
  }
});

// -----------------------------------------------------------------------------
// SYSTEM SETTINGS
// -----------------------------------------------------------------------------

apiRouter.get('/settings', async (req, res) => {
  const settings = await dbService.getSettings();
  res.json({ settings });
});

apiRouter.put('/settings', requireAdmin, async (req, res) => {
  const saved = await dbService.saveSettings(req.body);
  await dbService.logActivity(req.user.email, 'Updated CodeAtlas system configuration', 'Settings');
  res.json({ settings: saved, message: 'System settings saved to database.' });
});

// -----------------------------------------------------------------------------
// FILE / IMAGE STORAGE (Supabase Storage Integration)
// -----------------------------------------------------------------------------

apiRouter.post('/upload', requireAuth, express.raw({ type: ['image/png', 'image/jpeg', 'image/svg+xml', 'image/webp'], limit: '5mb' }), async (req, res) => {
  try {
    const contentType = req.headers['content-type'];
    const fileName = req.headers['x-file-name'] || `asset-${Date.now()}.${contentType.split('/')[1] || 'png'}`;

    const supabase = getSupabase();
    if (supabase) {
      const { data, error } = await supabase.storage.from('codeatlas-assets').upload(`uploads/${fileName}`, req.body, {
        contentType,
        upsert: true
      });
      if (error) {
        return res.status(400).json({ error: error.message });
      }
      const { data: publicUrlData } = supabase.storage.from('codeatlas-assets').getPublicUrl(`uploads/${fileName}`);
      return res.json({ url: publicUrlData.publicUrl, fileName });
    }

    // Dev/fallback response with base64 data URI
    const base64 = `data:${contentType};base64,${req.body.toString('base64')}`;
    res.json({ url: base64, fileName, note: 'Local buffer fallback; configure Supabase Storage for remote CDN asset hosting.' });
  } catch (err) {
    res.status(500).json({ error: 'File upload processing failure.' });
  }
});
