import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import { WebSocketServer, WebSocket } from "ws";
import bcrypt from "bcryptjs";
import { storage } from "./storage";
import { insertUserSchema } from "@shared/schema";
import { 
  insertTenantSchema,
  insertLandlordSchema,
  insertPropertySchema,
  insertContractSchema,
  insertPaymentSchema,
} from "@shared/schema";

// Extend session data interface
declare module 'express-session' {
  interface SessionData {
    userId: number;
  }
}

// Session middleware for user authentication
interface AuthenticatedRequest extends Request {
  user?: {
    id: number;
    email: string;
    fullName: string;
    userType: string;
  };
}

// Authentication middleware
const authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  const userId = (req.session as any)?.userId;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const user = await storage.getUser(userId);
  if (!user || !user.isActive) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  req.user = {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    userType: user.userType,
  };
  next();
};

// Role-based authorization middleware
const authorize = (roles: string[]) => {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.userType)) {
      return res.status(403).json({ message: "Forbidden" });
    }
    next();
  };
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "Bu email adresi zaten kullanımda" });
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      
      // Create user
      const user = await storage.createUser({
        ...userData,
        password: hashedPassword,
      });

      res.status(201).json({
        message: "Hesap başarıyla oluşturuldu",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
        },
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      
      // Handle Zod validation errors
      if (error.name === 'ZodError') {
        return res.status(400).json({ 
          message: "Geçersiz veri girişi",
          errors: error.errors 
        });
      }
      
      res.status(500).json({ message: "Hesap oluşturulurken bir hata oluştu" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find user
      const user = await storage.getUserByEmail(email);
      if (!user || !user.isActive) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }

      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Geçersiz email veya şifre" });
      }

      // Store user session
      (req.session as any).userId = user.id;

      res.json({
        message: "Giriş başarılı",
        user: {
          id: user.id,
          email: user.email,
          fullName: user.fullName,
          userType: user.userType,
        },
      });
    } catch (error) {
      console.error("Login error:", error);
      res.status(500).json({ message: "Giriş yapılırken bir hata oluştu" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Çıkış yapılırken bir hata oluştu" });
      }
      res.json({ message: "Çıkış başarılı" });
    });
  });

  app.get("/api/auth/me", authenticate, (req: AuthenticatedRequest, res) => {
    res.json({ user: req.user });
  });

  // Dashboard - accessible to all authenticated users
  app.get("/api/dashboard/stats", async (req: AuthenticatedRequest, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Tenants
  app.get("/api/tenants", async (req, res) => {
    try {
      const tenants = await storage.getTenants();
      res.json(tenants);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tenants" });
    }
  });

  app.get("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const tenant = await storage.getTenant(id);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch tenant" });
    }
  });

  app.post("/api/tenants", async (req, res) => {
    try {
      const validatedData = insertTenantSchema.parse(req.body);
      const tenant = await storage.createTenant(validatedData);
      res.status(201).json(tenant);
    } catch (error) {
      res.status(400).json({ message: "Invalid tenant data", error });
    }
  });

  app.put("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertTenantSchema.partial().parse(req.body);
      const tenant = await storage.updateTenant(id, validatedData);
      if (!tenant) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.json(tenant);
    } catch (error) {
      res.status(400).json({ message: "Invalid tenant data", error });
    }
  });

  app.delete("/api/tenants/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteTenant(id);
      if (!deleted) {
        return res.status(404).json({ message: "Tenant not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete tenant" });
    }
  });

  // Landlords
  app.get("/api/landlords", async (req, res) => {
    try {
      const landlords = await storage.getLandlords();
      res.json(landlords);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch landlords" });
    }
  });

  app.get("/api/landlords/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const landlord = await storage.getLandlord(id);
      if (!landlord) {
        return res.status(404).json({ message: "Landlord not found" });
      }
      res.json(landlord);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch landlord" });
    }
  });

  app.post("/api/landlords", async (req, res) => {
    try {
      const validatedData = insertLandlordSchema.parse(req.body);
      const landlord = await storage.createLandlord(validatedData);
      res.status(201).json(landlord);
    } catch (error) {
      res.status(400).json({ message: "Invalid landlord data", error });
    }
  });

  app.put("/api/landlords/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertLandlordSchema.partial().parse(req.body);
      const landlord = await storage.updateLandlord(id, validatedData);
      if (!landlord) {
        return res.status(404).json({ message: "Landlord not found" });
      }
      res.json(landlord);
    } catch (error) {
      res.status(400).json({ message: "Invalid landlord data", error });
    }
  });

  app.delete("/api/landlords/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteLandlord(id);
      if (!deleted) {
        return res.status(404).json({ message: "Landlord not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete landlord" });
    }
  });

  // Properties
  app.get("/api/properties", async (req, res) => {
    try {
      const properties = await storage.getPropertiesWithDetails();
      res.json(properties);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const property = await storage.getProperty(id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post("/api/properties", async (req, res) => {
    try {
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  app.put("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPropertySchema.partial().parse(req.body);
      const property = await storage.updateProperty(id, validatedData);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      res.status(400).json({ message: "Invalid property data", error });
    }
  });

  app.delete("/api/properties/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteProperty(id);
      if (!deleted) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete property" });
    }
  });

  // Contracts
  app.get("/api/contracts", async (req, res) => {
    try {
      const contracts = await storage.getContracts();
      const contractsWithDetails = await storage.getContractsWithDetails();
      console.log("Raw contracts:", contracts.length);
      console.log("Contracts with details:", contractsWithDetails.length);
      res.json(contractsWithDetails);
    } catch (error) {
      console.error("Contracts error:", error);
      res.status(500).json({ message: "Failed to fetch contracts" });
    }
  });

  app.get("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const contract = await storage.getContract(id);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch contract" });
    }
  });

  app.post("/api/contracts", async (req, res) => {
    try {
      const validatedData = insertContractSchema.parse(req.body);
      const contract = await storage.createContract(validatedData);
      res.status(201).json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid contract data", error });
    }
  });

  app.put("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertContractSchema.partial().parse(req.body);
      const contract = await storage.updateContract(id, validatedData);
      if (!contract) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.json(contract);
    } catch (error) {
      res.status(400).json({ message: "Invalid contract data", error });
    }
  });

  app.delete("/api/contracts/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deleteContract(id);
      if (!deleted) {
        return res.status(404).json({ message: "Contract not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete contract" });
    }
  });

  // Payments
  app.get("/api/payments", async (req, res) => {
    try {
      const payments = await storage.getPaymentsWithDetails();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });

  app.get("/api/payments/pending", async (req, res) => {
    try {
      const payments = await storage.getPendingPayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch pending payments" });
    }
  });

  app.get("/api/payments/overdue", async (req, res) => {
    try {
      const payments = await storage.getOverduePayments();
      res.json(payments);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch overdue payments" });
    }
  });

  app.get("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const payment = await storage.getPayment(id);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch payment" });
    }
  });

  app.post("/api/payments", async (req, res) => {
    try {
      const validatedData = insertPaymentSchema.parse(req.body);
      const payment = await storage.createPayment(validatedData);
      res.status(201).json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data", error });
    }
  });

  app.put("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const validatedData = insertPaymentSchema.partial().parse(req.body);
      const payment = await storage.updatePayment(id, validatedData);
      if (!payment) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.json(payment);
    } catch (error) {
      res.status(400).json({ message: "Invalid payment data", error });
    }
  });

  app.delete("/api/payments/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const deleted = await storage.deletePayment(id);
      if (!deleted) {
        return res.status(404).json({ message: "Payment not found" });
      }
      res.status(204).send();
    } catch (error) {
      res.status(500).json({ message: "Failed to delete payment" });
    }
  });

  const httpServer = createServer(app);
  
  // Setup WebSocket server for live chat
  const wss = new WebSocketServer({ server: httpServer, path: '/ws' });
  
  // Store active chat connections
  const chatConnections = new Map<string, WebSocket>();
  
  // Simple AI assistant responses (local, no API needed)
  const aiResponses = {
    greeting: [
      "Merhaba! KiraTakip AI asistanınızım. Size nasıl yardımcı olabilirim?",
      "Selam! Emlak yönetimi konularında size yardımcı olmak için buradayım.",
      "İyi günler! Kiralama süreçlerinizde nasıl destek olabilirim?"
    ],
    property: [
      "Mülk yönetimi konusunda size yardımcı olabilirim. Hangi konuda bilgi almak istiyorsunuz?",
      "Emlak portföyünüzü optimize etmek için önerilerim var. Detay için soru sorabilirsiniz.",
      "Mülk değerlendirmesi ve kiralama stratejileri hakkında bilgi verebilirim."
    ],
    tenant: [
      "Kiracı ilişkileri yönetimi konusunda deneyimliyim. Size nasıl yardımcı olabilirim?",
      "İyi kiracı seçimi ve iletişim stratejileri hakkında önerilerim var.",
      "Kiracı memnuniyeti artırmak için pratik çözümler önerebilirim."
    ],
    payment: [
      "Ödeme takibi ve finansal yönetim konularında size destek olabilirim.",
      "Kira ödemelerini optimize etmek için stratejiler geliştirebiliriz.",
      "Geciken ödemeler için etkili çözüm yolları önerebilirim."
    ],
    legal: [
      "Emlak hukuku ve kiralama mevzuatı hakkında genel bilgiler verebilirim.",
      "Sözleşme hazırlama ve yasal süreçler konusunda rehberlik edebilirim.",
      "Yasal haklar ve sorumluluklar hakkında bilgilendirme yapabilirim."
    ],
    default: [
      "Bu konuda size yardımcı olmaya çalışayım. Daha spesifik bir soru sorabilir misiniz?",
      "İlginç bir soru! Size en iyi şekilde yardımcı olmak için biraz daha detay verebilir misiniz?",
      "Emlak yönetimi, kiracı ilişkileri, ödeme takibi gibi konularda uzmanım. Hangi alanda yardım istiyorsunuz?"
    ]
  };
  
  function getAIResponse(message: string): string {
    const lowerMessage = message.toLowerCase();
    
    if (lowerMessage.includes('merhaba') || lowerMessage.includes('selam') || lowerMessage.includes('hello')) {
      return aiResponses.greeting[Math.floor(Math.random() * aiResponses.greeting.length)];
    }
    
    if (lowerMessage.includes('mülk') || lowerMessage.includes('emlak') || lowerMessage.includes('property')) {
      return aiResponses.property[Math.floor(Math.random() * aiResponses.property.length)];
    }
    
    if (lowerMessage.includes('kiracı') || lowerMessage.includes('tenant')) {
      return aiResponses.tenant[Math.floor(Math.random() * aiResponses.tenant.length)];
    }
    
    if (lowerMessage.includes('ödeme') || lowerMessage.includes('kira') || lowerMessage.includes('payment')) {
      return aiResponses.payment[Math.floor(Math.random() * aiResponses.payment.length)];
    }
    
    if (lowerMessage.includes('hukuk') || lowerMessage.includes('yasal') || lowerMessage.includes('legal')) {
      return aiResponses.legal[Math.floor(Math.random() * aiResponses.legal.length)];
    }
    
    return aiResponses.default[Math.floor(Math.random() * aiResponses.default.length)];
  }
  
  wss.on('connection', (ws: WebSocket, req) => {
    const connectionId = Date.now().toString();
    chatConnections.set(connectionId, ws);
    
    console.log(`Chat connection established: ${connectionId}`);
    
    // Send welcome message
    ws.send(JSON.stringify({
      type: 'ai_message',
      message: 'Merhaba! KiraTakip AI asistanınızım. Size nasıl yardımcı olabilirim?',
      timestamp: new Date().toISOString()
    }));
    
    ws.on('message', (data: Buffer) => {
      try {
        const message = JSON.parse(data.toString());
        
        if (message.type === 'user_message') {
          // Echo user message back
          ws.send(JSON.stringify({
            type: 'user_message',
            message: message.message,
            timestamp: new Date().toISOString()
          }));
          
          // Generate AI response
          setTimeout(() => {
            const aiResponse = getAIResponse(message.message);
            ws.send(JSON.stringify({
              type: 'ai_message',
              message: aiResponse,
              timestamp: new Date().toISOString()
            }));
          }, 1000); // 1 second delay for natural feel
        }
        
        if (message.type === 'support_request') {
          // Handle support requests
          ws.send(JSON.stringify({
            type: 'support_message',
            message: 'Destek talebiniz alındı. Kısa süre içinde size dönüş yapılacaktır.',
            timestamp: new Date().toISOString()
          }));
        }
        
      } catch (error) {
        console.error('WebSocket message error:', error);
      }
    });
    
    ws.on('close', () => {
      chatConnections.delete(connectionId);
      console.log(`Chat connection closed: ${connectionId}`);
    });
    
    ws.on('error', (error) => {
      console.error('WebSocket error:', error);
      chatConnections.delete(connectionId);
    });
  });
  
  // API endpoint for chat history or admin features
  app.get("/api/chat/status", (req, res) => {
    res.json({
      activeConnections: chatConnections.size,
      status: "online"
    });
  });
  
  return httpServer;
}
