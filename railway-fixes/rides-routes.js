// rides-routes.js - Rotas para adicionar ao Railway

// ===== ENDPOINT: POST /api/rides-simple/create =====
app.post('/api/rides-simple/create', async (req, res) => {
  try {
    const {
      fromAddress,
      toAddress,
      departureDate,
      price,
      maxPassengers,
      type,
      description,
      driverId
    } = req.body;
    
    console.log('🚗 Criando viagem:', req.body);
    
    // Validações básicas
    if (!fromAddress || !toAddress || !departureDate || !price) {
      return res.status(400).json({
        success: false,
        error: 'Campos obrigatórios: fromAddress, toAddress, departureDate, price'
      });
    }
    
    // Criar nova viagem
    const [newRide] = await db.insert(rides)
      .values({
        fromAddress,
        toAddress,
        departureDate: new Date(departureDate),
        price: parseFloat(price),
        maxPassengers: parseInt(maxPassengers) || 4,
        type: type || 'sedan',
        description: description || 'Viagem confortável',
        driverId: driverId || 'temp-driver',
        status: 'available',
        createdAt: new Date(),
        updatedAt: new Date()
      })
      .returning();
    
    console.log('✅ Viagem criada:', newRide);
    res.json({ 
      success: true, 
      ride: newRide,
      message: 'Viagem publicada com sucesso!' 
    });
    
  } catch (error) {
    console.error('❌ Erro ao criar viagem:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== ENDPOINT: GET /api/rides =====
app.get('/api/rides', async (req, res) => {
  try {
    console.log('📋 Listando viagens disponíveis...');
    
    const availableRides = await db.select()
      .from(rides)
      .where(eq(rides.status, 'available'))
      .orderBy(rides.departureDate);
    
    console.log(`✅ Encontradas ${availableRides.length} viagens`);
    res.json({ success: true, rides: availableRides });
    
  } catch (error) {
    console.error('❌ Erro ao listar viagens:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

// ===== ENDPOINT: POST /api/rides =====
app.post('/api/rides', async (req, res) => {
  try {
    // Same as /api/rides-simple/create for compatibility
    const result = await createRide(req.body);
    res.json(result);
  } catch (error) {
    console.error('❌ Erro ao criar viagem:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});