import { NextRequest, NextResponse } from 'next/server';

interface ServiceHealthStatus {
  service: string;
  status: 'healthy' | 'degraded' | 'down';
  lastCheck: string;
  error?: string;
  responseTime?: number;
}

interface SystemHealth {
  overall: 'healthy' | 'degraded' | 'down';
  services: ServiceHealthStatus[];
  environment: string;
  timestamp: string;
}

async function checkAIService(): Promise<ServiceHealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if AI service is configured
    if (!process.env.DEEPSEEK_API_KEY) {
      return {
        service: 'AI Service (DeepSeek)',
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: 'API key not configured'
      };
    }

    // Simple health check - don't make actual AI calls in health check
    return {
      service: 'AI Service (DeepSeek)',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      service: 'AI Service (DeepSeek)',
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkScrapingService(): Promise<ServiceHealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check if scraping is enabled
    if (process.env.DISABLE_SCRAPING === 'true') {
      return {
        service: 'Web Scraping',
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: 'Scraping disabled in production'
      };
    }

    return {
      service: 'Web Scraping',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      service: 'Web Scraping',
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkFirebaseService(): Promise<ServiceHealthStatus> {
  const startTime = Date.now();
  
  try {
    // Check Firebase configuration
    const requiredVars = [
      'NEXT_PUBLIC_FIREBASE_API_KEY',
      'NEXT_PUBLIC_FIREBASE_PROJECT_ID',
      'FIREBASE_ADMIN_PRIVATE_KEY'
    ];
    
    const missingVars = requiredVars.filter(varName => !process.env[varName]);
    
    if (missingVars.length > 0) {
      return {
        service: 'Firebase',
        status: 'down',
        lastCheck: new Date().toISOString(),
        error: `Missing environment variables: ${missingVars.join(', ')}`
      };
    }

    return {
      service: 'Firebase',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      service: 'Firebase',
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

async function checkDatabaseService(): Promise<ServiceHealthStatus> {
  const startTime = Date.now();
  
  try {
    // For now, assume database is healthy if app is running
    // In a real implementation, you'd check actual database connectivity
    return {
      service: 'Database',
      status: 'healthy',
      lastCheck: new Date().toISOString(),
      responseTime: Date.now() - startTime
    };
  } catch (error) {
    return {
      service: 'Database',
      status: 'down',
      lastCheck: new Date().toISOString(),
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
}

export async function GET(request: NextRequest) {
  try {
    // Run all health checks in parallel
    const [aiHealth, scrapingHealth, firebaseHealth, databaseHealth] = await Promise.all([
      checkAIService(),
      checkScrapingService(),
      checkFirebaseService(),
      checkDatabaseService()
    ]);

    const services = [aiHealth, scrapingHealth, firebaseHealth, databaseHealth];
    
    // Determine overall health
    const downServices = services.filter(s => s.status === 'down');
    const degradedServices = services.filter(s => s.status === 'degraded');
    
    let overallStatus: 'healthy' | 'degraded' | 'down';
    if (downServices.length > 0) {
      overallStatus = downServices.length === services.length ? 'down' : 'degraded';
    } else if (degradedServices.length > 0) {
      overallStatus = 'degraded';
    } else {
      overallStatus = 'healthy';
    }

    const healthReport: SystemHealth = {
      overall: overallStatus,
      services,
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString()
    };

    // Set appropriate HTTP status code
    const statusCode = overallStatus === 'healthy' ? 200 : 
                      overallStatus === 'degraded' ? 200 : 503;

    return NextResponse.json(healthReport, { status: statusCode });

  } catch (error) {
    console.error('Health check error:', error);
    
    return NextResponse.json({
      overall: 'down',
      services: [],
      environment: process.env.NODE_ENV || 'unknown',
      timestamp: new Date().toISOString(),
      error: 'Health check system failure'
    }, { status: 503 });
  }
}

// POST endpoint for detailed health checks (admin only)
export async function POST(request: NextRequest) {
  try {
    const { service } = await request.json();
    
    // Run detailed health check for specific service
    let serviceHealth: ServiceHealthStatus;
    
    switch (service) {
      case 'ai':
        serviceHealth = await checkAIService();
        break;
      case 'scraping':
        serviceHealth = await checkScrapingService();
        break;
      case 'firebase':
        serviceHealth = await checkFirebaseService();
        break;
      case 'database':
        serviceHealth = await checkDatabaseService();
        break;
      default:
        return NextResponse.json({ error: 'Unknown service' }, { status: 400 });
    }

    return NextResponse.json(serviceHealth);

  } catch (error) {
    console.error('Detailed health check error:', error);
    return NextResponse.json({ error: 'Health check failed' }, { status: 500 });
  }
}
