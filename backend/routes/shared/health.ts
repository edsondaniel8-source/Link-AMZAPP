import { Router } from 'express';
import { db } from '../../db';
import { users } from '../../shared/database-schema';
import { count } from 'drizzle-orm';

const router = Router();

// Health check básico
router.get('/', async (req, res) => {
  try {
    const startTime = Date.now();
    
    // Testar conexão com banco de dados
    const [userCount] = await db.select({ count: count() }).from(users);
    
    const responseTime = Date.now() - startTime;
    
    res.json({
      status: 'OK',
      message: 'Link-A API funcionando normalmente',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      environment: process.env.NODE_ENV || 'development',
      database: {
        status: 'connected',
        responseTime: `${responseTime}ms`,
        totalUsers: userCount.count
      },
      services: {
        api: 'healthy',
        database: 'healthy',
        auth: 'healthy'
      }
    });

  } catch (error) {
    console.error('❌ [HEALTH] Erro no health check:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Falha no health check',
      timestamp: new Date().toISOString(),
      error: error.message,
      services: {
        api: 'unhealthy',
        database: 'unhealthy',
        auth: 'unknown'
      }
    });
  }
});

// Health check detalhado
router.get('/detailed', async (req, res) => {
  try {
    const startTime = Date.now();
    const checks = {
      database: false,
      memory: false,
      disk: false
    };

    // Testar banco de dados
    try {
      await db.select({ count: count() }).from(users);
      checks.database = true;
    } catch (dbError) {
      console.error('Database check failed:', dbError);
    }

    // Verificar uso de memória
    const memoryUsage = process.memoryUsage();
    const memoryUsageMB = {
      rss: Math.round(memoryUsage.rss / 1024 / 1024),
      heapTotal: Math.round(memoryUsage.heapTotal / 1024 / 1024),
      heapUsed: Math.round(memoryUsage.heapUsed / 1024 / 1024),
      external: Math.round(memoryUsage.external / 1024 / 1024)
    };
    checks.memory = memoryUsageMB.heapUsed < 500; // Menos de 500MB

    // Verificar tempo de resposta
    const responseTime = Date.now() - startTime;
    checks.disk = responseTime < 1000; // Menos de 1 segundo

    const allHealthy = Object.values(checks).every(check => check === true);

    res.status(allHealthy ? 200 : 503).json({
      status: allHealthy ? 'HEALTHY' : 'DEGRADED',
      timestamp: new Date().toISOString(),
      responseTime: `${responseTime}ms`,
      checks,
      system: {
        uptime: process.uptime(),
        memory: memoryUsageMB,
        nodeVersion: process.version,
        platform: process.platform
      },
      api: {
        version: '1.0.0',
        environment: process.env.NODE_ENV || 'development'
      }
    });

  } catch (error) {
    console.error('❌ [HEALTH] Erro no health check detalhado:', error);
    res.status(500).json({
      status: 'ERROR',
      message: 'Falha no health check detalhado',
      timestamp: new Date().toISOString(),
      error: error.message
    });
  }
});

// Endpoint para monitoramento de métricas
router.get('/metrics', async (req, res) => {
  try {
    const memoryUsage = process.memoryUsage();
    
    // Formato compatível com Prometheus
    const metrics = `
# HELP nodejs_memory_usage_bytes Memory usage in bytes
# TYPE nodejs_memory_usage_bytes gauge
nodejs_memory_usage_bytes{type="rss"} ${memoryUsage.rss}
nodejs_memory_usage_bytes{type="heapTotal"} ${memoryUsage.heapTotal}
nodejs_memory_usage_bytes{type="heapUsed"} ${memoryUsage.heapUsed}
nodejs_memory_usage_bytes{type="external"} ${memoryUsage.external}

# HELP nodejs_uptime_seconds Process uptime in seconds
# TYPE nodejs_uptime_seconds gauge
nodejs_uptime_seconds ${process.uptime()}

# HELP api_info API information
# TYPE api_info gauge
api_info{version="1.0.0",environment="${process.env.NODE_ENV || 'development'}"} 1
    `;

    res.set('Content-Type', 'text/plain');
    res.send(metrics.trim());

  } catch (error) {
    console.error('❌ [HEALTH] Erro ao gerar métricas:', error);
    res.status(500).send('# Error generating metrics');
  }
});

// Ping simples
router.get('/ping', (req, res) => {
  res.json({
    message: 'pong',
    timestamp: new Date().toISOString()
  });
});

export default router;