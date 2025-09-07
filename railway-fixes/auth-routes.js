// auth-routes.js - Rotas para adicionar ao Railway

// ===== ENDPOINT: POST /api/auth/register =====
app.post('/api/auth/register', async (req, res) => {
  try {
    const { uid, email, displayName, photoURL } = req.body;
    
    console.log('📝 Registrando usuário:', { uid, email, displayName });
    
    // Verificar se usuário já existe
    const existingUser = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    
    if (existingUser.length > 0) {
      return res.json({ success: true, user: existingUser[0], message: 'Usuário já existe' });
    }
    
    // Criar novo usuário
    const [newUser] = await db.insert(users)
      .values({
        uid,
        email,
        displayName,
        photoURL,
        roles: ['client'], // Default role
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    console.log('✅ Usuário criado:', newUser);
    res.json({ success: true, user: newUser });
    
  } catch (error) {
    console.error('❌ Erro ao registrar:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== ENDPOINT: PUT /api/auth/roles =====
app.put('/api/auth/roles', async (req, res) => {
  try {
    const { roles } = req.body;
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token não fornecido' });
    }
    
    // Verificar token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    console.log('🔧 Atualizando roles:', { uid, roles });
    
    // Atualizar roles do usuário
    const [updatedUser] = await db.update(users)
      .set({ 
        roles,
        updatedAt: new Date()
      })
      .where(eq(users.uid, uid))
      .returning();
    
    if (!updatedUser) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    console.log('✅ Roles atualizados:', updatedUser);
    res.json({ success: true, user: updatedUser });
    
  } catch (error) {
    console.error('❌ Erro ao atualizar roles:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== ENDPOINT: GET /api/auth/profile =====
app.get('/api/auth/profile', async (req, res) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ success: false, error: 'Token não fornecido' });
    }
    
    // Verificar token Firebase
    const decodedToken = await admin.auth().verifyIdToken(token);
    const uid = decodedToken.uid;
    
    console.log('🔍 Buscando perfil:', uid);
    
    // Buscar usuário
    const [user] = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    
    if (!user) {
      return res.status(404).json({ success: false, error: 'Usuário não encontrado' });
    }
    
    console.log('✅ Perfil encontrado:', user);
    res.json({ success: true, user });
    
  } catch (error) {
    console.error('❌ Erro ao buscar perfil:', error);
    res.status(401).json({ success: false, error: 'Token inválido' });
  }
});