import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
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
    } catch (error) {
      console.error("Registration error:", error);
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
  return httpServer;
}
