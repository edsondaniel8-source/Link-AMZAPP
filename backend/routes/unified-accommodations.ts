import { Router } from 'express';
import { Pool } from 'pg';
import { z } from 'zod';

const router = Router();
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// ===== SCHEMAS DE VALIDAÇÃO =====
const createAccommodationSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  type: z.enum(["hotel", "guesthouse", "apartment", "villa", "lodge"]),
  address: z.string().min(1, "Endereço é obrigatório"),
  city: z.string().min(1, "Cidade é obrigatória"),
  province: z.string().min(1, "Província é obrigatória"),
  description: z.string().optional(),
  amenities: z.array(z.string()).default([]),
  maxGuests: z.number().min(1),
  bedrooms: z.number().min(1),
  bathrooms: z.number().min(1),
  pricePerNight: z.number().min(0),
  minimumNights: z.number().min(1).default(1),
});

const searchAccommodationsSchema = z.object({
  city: z.string().optional(),
  province: z.string().optional(),
  type: z.string().optional(),
  maxPrice: z.number().optional(),
  minGuests: z.number().optional(),
  checkIn: z.string().optional(),
  checkOut: z.string().optional(),
});

// ===== BUSCAR ALOJAMENTOS =====
router.get('/search', async (req, res) => {
  try {
    const { city, province, type, maxPrice, minGuests, checkIn, checkOut } = searchAccommodationsSchema.parse({
      ...req.query,
      maxPrice: req.query.maxPrice ? parseFloat(req.query.maxPrice as string) : undefined,
      minGuests: req.query.minGuests ? parseInt(req.query.minGuests as string) : undefined,
    });

    let query = `
      SELECT 
        a.*,
        u.first_name || ' ' || u.last_name as host_name,
        u.rating as host_rating,
        u.phone as host_phone
      FROM accommodations a
      JOIN users u ON a.host_id = u.id
      WHERE a.is_available = true
    `;

    const params: any[] = [];
    let paramCount = 0;

    if (city) {
      paramCount++;
      query += ` AND LOWER(a.city) LIKE LOWER($${paramCount})`;
      params.push(`%${city}%`);
    }

    if (province) {
      paramCount++;
      query += ` AND LOWER(a.province) LIKE LOWER($${paramCount})`;
      params.push(`%${province}%`);
    }

    if (type) {
      paramCount++;
      query += ` AND a.type = $${paramCount}`;
      params.push(type);
    }

    if (maxPrice) {
      paramCount++;
      query += ` AND a.price_per_night <= $${paramCount}`;
      params.push(maxPrice);
    }

    if (minGuests) {
      paramCount++;
      query += ` AND a.max_guests >= $${paramCount}`;
      params.push(minGuests);
    }

    // Verificar disponibilidade se datas fornecidas
    if (checkIn && checkOut) {
      query += `
        AND a.id NOT IN (
          SELECT DISTINCT b.service_id 
          FROM bookings_unified b
          WHERE b.service_type = 'accommodation'
            AND b.status IN ('pending', 'confirmed')
            AND (
              (DATE($${paramCount + 1}) BETWEEN b.check_in_date AND b.check_out_date - INTERVAL '1 day') OR
              (DATE($${paramCount + 2}) BETWEEN b.check_in_date + INTERVAL '1 day' AND b.check_out_date) OR
              (b.check_in_date BETWEEN DATE($${paramCount + 1}) AND DATE($${paramCount + 2}) - INTERVAL '1 day')
            )
        )
      `;
      params.push(checkIn, checkOut);
    }

    query += ` ORDER BY a.rating DESC, a.created_at DESC`;

    const result = await pool.query(query, params);

    const accommodations = result.rows.map((row: any) => ({
      id: row.id,
      hostId: row.host_id,
      name: row.name,
      type: row.type,
      address: row.address,
      city: row.city,
      province: row.province,
      description: row.description,
      amenities: row.amenities || [],
      images: row.images || [],
      maxGuests: row.max_guests,
      bedrooms: row.bedrooms,
      bathrooms: row.bathrooms,
      pricePerNight: parseFloat(row.price_per_night),
      rating: parseFloat(row.rating),
      totalReviews: row.total_reviews,
      minimumNights: row.minimum_nights,
      checkInTime: row.check_in_time,
      checkOutTime: row.check_out_time,
      hostName: row.host_name,
      hostRating: parseFloat(row.host_rating) || 4.5,
      hostPhone: row.host_phone,
      createdAt: row.created_at
    }));

    res.json({ 
      success: true,
      accommodations,
      total: accommodations.length,
      searchCriteria: { city, province, type, maxPrice, minGuests, checkIn, checkOut }
    });

  } catch (error) {
    console.error('Erro na busca de alojamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== CRIAR NOVO ALOJAMENTO =====
router.post('/create', async (req, res) => {
  try {
    const accommodationData = createAccommodationSchema.parse(req.body);
    
    // Usar hostId do usuário autenticado ou teste
    const hostId = req.body.hostId || '9624afd4-5385-4601-af6e-4cf747dba1bc';

    const query = `
      INSERT INTO accommodations (
        host_id, name, type, address, city, province, description, amenities,
        max_guests, bedrooms, bathrooms, price_per_night, minimum_nights
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)
      RETURNING *
    `;

    const values = [
      hostId,
      accommodationData.name,
      accommodationData.type,
      accommodationData.address,
      accommodationData.city,
      accommodationData.province,
      accommodationData.description || null,
      JSON.stringify(accommodationData.amenities),
      accommodationData.maxGuests,
      accommodationData.bedrooms,
      accommodationData.bathrooms,
      accommodationData.pricePerNight,
      accommodationData.minimumNights
    ];

    const result = await pool.query(query, values);
    const newAccommodation = result.rows[0];

    res.status(201).json({
      success: true,
      message: 'Alojamento criado com sucesso',
      accommodation: {
        id: newAccommodation.id,
        hostId: newAccommodation.host_id,
        name: newAccommodation.name,
        type: newAccommodation.type,
        address: newAccommodation.address,
        city: newAccommodation.city,
        province: newAccommodation.province,
        description: newAccommodation.description,
        amenities: newAccommodation.amenities,
        maxGuests: newAccommodation.max_guests,
        bedrooms: newAccommodation.bedrooms,
        bathrooms: newAccommodation.bathrooms,
        pricePerNight: parseFloat(newAccommodation.price_per_night),
        minimumNights: newAccommodation.minimum_nights,
        rating: parseFloat(newAccommodation.rating),
        isAvailable: newAccommodation.is_available,
        createdAt: newAccommodation.created_at
      }
    });

  } catch (error) {
    console.error('Erro ao criar alojamento:', error);
    
    if (error instanceof z.ZodError) {
      return res.status(400).json({ 
        error: 'Dados inválidos',
        details: error.errors.map(e => e.message)
      });
    }
    
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== BUSCAR ALOJAMENTOS DO ANFITRIÃO =====
router.get('/host/:hostId', async (req, res) => {
  try {
    const { hostId } = req.params;

    const query = `
      SELECT 
        a.*,
        COUNT(b.id) as total_bookings,
        COALESCE(SUM(CASE WHEN b.status = 'confirmed' THEN b.total_amount ELSE 0 END), 0) as confirmed_revenue,
        COUNT(CASE WHEN b.status = 'pending' THEN 1 END) as pending_bookings
      FROM accommodations a
      LEFT JOIN bookings_unified b ON a.id = b.service_id AND b.service_type = 'accommodation'
      WHERE a.host_id = $1
      GROUP BY a.id
      ORDER BY a.created_at DESC
    `;

    const result = await pool.query(query, [hostId]);

    const accommodations = result.rows.map((row: any) => ({
      id: row.id,
      name: row.name,
      type: row.type,
      address: row.address,
      city: row.city,
      province: row.province,
      maxGuests: row.max_guests,
      pricePerNight: parseFloat(row.price_per_night),
      rating: parseFloat(row.rating),
      totalReviews: row.total_reviews,
      isAvailable: row.is_available,
      totalBookings: parseInt(row.total_bookings),
      confirmedRevenue: parseFloat(row.confirmed_revenue),
      pendingBookings: parseInt(row.pending_bookings),
      createdAt: row.created_at
    }));

    res.json({ success: true, accommodations });

  } catch (error) {
    console.error('Erro ao buscar alojamentos do anfitrião:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== DETALHES DO ALOJAMENTO =====
router.get('/:accommodationId', async (req, res) => {
  try {
    const { accommodationId } = req.params;

    const query = `
      SELECT 
        a.*,
        u.first_name || ' ' || u.last_name as host_name,
        u.rating as host_rating,
        u.phone as host_phone
      FROM accommodations a
      JOIN users u ON a.host_id = u.id
      WHERE a.id = $1
    `;

    const result = await pool.query(query, [accommodationId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Alojamento não encontrado' });
    }

    const accommodation = result.rows[0];

    res.json({
      success: true,
      accommodation: {
        id: accommodation.id,
        hostId: accommodation.host_id,
        name: accommodation.name,
        type: accommodation.type,
        address: accommodation.address,
        city: accommodation.city,
        province: accommodation.province,
        description: accommodation.description,
        amenities: accommodation.amenities || [],
        images: accommodation.images || [],
        maxGuests: accommodation.max_guests,
        bedrooms: accommodation.bedrooms,
        bathrooms: accommodation.bathrooms,
        pricePerNight: parseFloat(accommodation.price_per_night),
        rating: parseFloat(accommodation.rating),
        totalReviews: accommodation.total_reviews,
        isAvailable: accommodation.is_available,
        minimumNights: accommodation.minimum_nights,
        checkInTime: accommodation.check_in_time,
        checkOutTime: accommodation.check_out_time,
        hostName: accommodation.host_name,
        hostRating: parseFloat(accommodation.host_rating) || 4.5,
        hostPhone: accommodation.host_phone,
        createdAt: accommodation.created_at
      }
    });

  } catch (error) {
    console.error('Erro ao buscar detalhes do alojamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// ===== ATUALIZAR ALOJAMENTO =====
router.put('/:accommodationId', async (req, res) => {
  try {
    const { accommodationId } = req.params;
    const updateData = req.body;

    // Verificar se o alojamento existe
    const checkQuery = 'SELECT * FROM accommodations WHERE id = $1';
    const checkResult = await pool.query(checkQuery, [accommodationId]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Alojamento não encontrado' });
    }

    // Construir query de atualização dinamicamente
    const updates: string[] = [];
    const values: any[] = [];
    let paramCount = 0;

    const allowedUpdates = [
      'name', 'description', 'price_per_night', 'is_available', 
      'amenities', 'minimum_nights', 'max_guests'
    ];

    for (const [key, value] of Object.entries(updateData)) {
      if (allowedUpdates.includes(key) && value !== undefined) {
        paramCount++;
        const dbKey = key === 'pricePerNight' ? 'price_per_night' : 
                     key === 'isAvailable' ? 'is_available' :
                     key === 'minimumNights' ? 'minimum_nights' :
                     key === 'maxGuests' ? 'max_guests' : key;
        
        updates.push(`${dbKey} = $${paramCount}`);
        values.push(key === 'amenities' ? JSON.stringify(value) : value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'Nenhum campo válido para atualizar' });
    }

    paramCount++;
    updates.push(`updated_at = $${paramCount}`);
    values.push(new Date());

    values.push(accommodationId); // Para o WHERE

    const updateQuery = `
      UPDATE accommodations 
      SET ${updates.join(', ')}
      WHERE id = $${paramCount + 1}
      RETURNING *
    `;

    const result = await pool.query(updateQuery, values);

    res.json({
      success: true,
      message: 'Alojamento atualizado com sucesso',
      accommodation: result.rows[0]
    });

  } catch (error) {
    console.error('Erro ao atualizar alojamento:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

export default router;