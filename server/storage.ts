import {
  tenants,
  landlords,
  properties,
  contracts,
  payments,
  type Tenant,
  type Landlord,
  type Property,
  type Contract,
  type Payment,
  type InsertTenant,
  type InsertLandlord,
  type InsertProperty,
  type InsertContract,
  type InsertPayment,
  type PropertyWithDetails,
  type ContractWithDetails,
  type PaymentWithDetails,
} from "@shared/schema";

export interface IStorage {
  // Tenants
  getTenant(id: number): Promise<Tenant | undefined>;
  getTenants(): Promise<Tenant[]>;
  createTenant(tenant: InsertTenant): Promise<Tenant>;
  updateTenant(id: number, tenant: Partial<InsertTenant>): Promise<Tenant | undefined>;
  deleteTenant(id: number): Promise<boolean>;

  // Landlords
  getLandlord(id: number): Promise<Landlord | undefined>;
  getLandlords(): Promise<Landlord[]>;
  createLandlord(landlord: InsertLandlord): Promise<Landlord>;
  updateLandlord(id: number, landlord: Partial<InsertLandlord>): Promise<Landlord | undefined>;
  deleteLandlord(id: number): Promise<boolean>;

  // Properties
  getProperty(id: number): Promise<Property | undefined>;
  getProperties(): Promise<Property[]>;
  getPropertiesWithDetails(): Promise<PropertyWithDetails[]>;
  getPropertiesByLandlord(landlordId: number): Promise<Property[]>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: number, property: Partial<InsertProperty>): Promise<Property | undefined>;
  deleteProperty(id: number): Promise<boolean>;

  // Contracts
  getContract(id: number): Promise<Contract | undefined>;
  getContracts(): Promise<Contract[]>;
  getContractsWithDetails(): Promise<ContractWithDetails[]>;
  getActiveContractsByProperty(propertyId: number): Promise<Contract[]>;
  getActiveContractsByTenant(tenantId: number): Promise<Contract[]>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContract(id: number, contract: Partial<InsertContract>): Promise<Contract | undefined>;
  deleteContract(id: number): Promise<boolean>;

  // Payments
  getPayment(id: number): Promise<Payment | undefined>;
  getPayments(): Promise<Payment[]>;
  getPaymentsWithDetails(): Promise<PaymentWithDetails[]>;
  getPaymentsByContract(contractId: number): Promise<Payment[]>;
  getPendingPayments(): Promise<PaymentWithDetails[]>;
  getOverduePayments(): Promise<PaymentWithDetails[]>;
  createPayment(payment: InsertPayment): Promise<Payment>;
  updatePayment(id: number, payment: Partial<InsertPayment>): Promise<Payment | undefined>;
  deletePayment(id: number): Promise<boolean>;

  // Dashboard stats
  getDashboardStats(): Promise<{
    totalTenants: number;
    activeProperties: number;
    monthlyIncome: number;
    pendingPayments: number;
  }>;
}

export class MemStorage implements IStorage {
  private tenants: Map<number, Tenant>;
  private landlords: Map<number, Landlord>;
  private properties: Map<number, Property>;
  private contracts: Map<number, Contract>;
  private payments: Map<number, Payment>;
  private currentId: number;

  constructor() {
    this.tenants = new Map();
    this.landlords = new Map();
    this.properties = new Map();
    this.contracts = new Map();
    this.payments = new Map();
    this.currentId = 1;
  }

  // Tenants
  async getTenant(id: number): Promise<Tenant | undefined> {
    return this.tenants.get(id);
  }

  async getTenants(): Promise<Tenant[]> {
    return Array.from(this.tenants.values());
  }

  async createTenant(insertTenant: InsertTenant): Promise<Tenant> {
    const id = this.currentId++;
    const tenant: Tenant = {
      id,
      name: insertTenant.name,
      email: insertTenant.email,
      phone: insertTenant.phone,
      nationalId: insertTenant.nationalId,
      address: insertTenant.address ?? null,
      emergencyContact: insertTenant.emergencyContact ?? null,
      emergencyPhone: insertTenant.emergencyPhone ?? null,
      createdAt: new Date(),
    };
    this.tenants.set(id, tenant);
    return tenant;
  }

  async updateTenant(id: number, update: Partial<InsertTenant>): Promise<Tenant | undefined> {
    const tenant = this.tenants.get(id);
    if (!tenant) return undefined;
    
    const updated = { ...tenant, ...update };
    this.tenants.set(id, updated);
    return updated;
  }

  async deleteTenant(id: number): Promise<boolean> {
    return this.tenants.delete(id);
  }

  // Landlords
  async getLandlord(id: number): Promise<Landlord | undefined> {
    return this.landlords.get(id);
  }

  async getLandlords(): Promise<Landlord[]> {
    return Array.from(this.landlords.values());
  }

  async createLandlord(insertLandlord: InsertLandlord): Promise<Landlord> {
    const id = this.currentId++;
    const landlord: Landlord = {
      id,
      name: insertLandlord.name,
      email: insertLandlord.email,
      phone: insertLandlord.phone,
      nationalId: insertLandlord.nationalId,
      address: insertLandlord.address ?? null,
      bankAccount: insertLandlord.bankAccount ?? null,
      taxNumber: insertLandlord.taxNumber ?? null,
      createdAt: new Date(),
    };
    this.landlords.set(id, landlord);
    return landlord;
  }

  async updateLandlord(id: number, update: Partial<InsertLandlord>): Promise<Landlord | undefined> {
    const landlord = this.landlords.get(id);
    if (!landlord) return undefined;
    
    const updated = { ...landlord, ...update };
    this.landlords.set(id, updated);
    return updated;
  }

  async deleteLandlord(id: number): Promise<boolean> {
    return this.landlords.delete(id);
  }

  // Properties
  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesWithDetails(): Promise<PropertyWithDetails[]> {
    const properties = Array.from(this.properties.values());
    const result: PropertyWithDetails[] = [];

    for (const property of properties) {
      const landlord = this.landlords.get(property.landlordId);
      if (!landlord) continue;

      const activeContract = Array.from(this.contracts.values()).find(
        c => c.propertyId === property.id && c.isActive
      );

      let tenant: Tenant | undefined;
      let lastPayment: Payment | undefined;

      if (activeContract) {
        tenant = this.tenants.get(activeContract.tenantId);
        const propertyPayments = Array.from(this.payments.values())
          .filter(p => p.contractId === activeContract.id)
          .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        lastPayment = propertyPayments[0];
      }

      result.push({
        ...property,
        landlord,
        tenant,
        contract: activeContract,
        lastPayment,
      });
    }

    return result;
  }

  async getPropertiesByLandlord(landlordId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(p => p.landlordId === landlordId);
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.currentId++;
    const property: Property = {
      ...insertProperty,
      id,
      createdAt: new Date(),
    };
    this.properties.set(id, property);
    return property;
  }

  async updateProperty(id: number, update: Partial<InsertProperty>): Promise<Property | undefined> {
    const property = this.properties.get(id);
    if (!property) return undefined;
    
    const updated = { ...property, ...update };
    this.properties.set(id, updated);
    return updated;
  }

  async deleteProperty(id: number): Promise<boolean> {
    return this.properties.delete(id);
  }

  // Contracts
  async getContract(id: number): Promise<Contract | undefined> {
    return this.contracts.get(id);
  }

  async getContracts(): Promise<Contract[]> {
    return Array.from(this.contracts.values());
  }

  async getContractsWithDetails(): Promise<ContractWithDetails[]> {
    const contracts = Array.from(this.contracts.values());
    const result: ContractWithDetails[] = [];

    for (const contract of contracts) {
      const tenant = this.tenants.get(contract.tenantId);
      const property = this.properties.get(contract.propertyId);
      const landlord = this.landlords.get(contract.landlordId);

      if (tenant && property && landlord) {
        result.push({
          ...contract,
          tenant,
          property,
          landlord,
        });
      }
    }

    return result;
  }

  async getActiveContractsByProperty(propertyId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      c => c.propertyId === propertyId && c.isActive
    );
  }

  async getActiveContractsByTenant(tenantId: number): Promise<Contract[]> {
    return Array.from(this.contracts.values()).filter(
      c => c.tenantId === tenantId && c.isActive
    );
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const id = this.currentId++;
    const contract: Contract = {
      ...insertContract,
      id,
      createdAt: new Date(),
    };
    this.contracts.set(id, contract);

    // Update property availability
    if (contract.isActive) {
      const property = this.properties.get(contract.propertyId);
      if (property) {
        this.properties.set(contract.propertyId, { ...property, isAvailable: false });
      }
    }

    return contract;
  }

  async updateContract(id: number, update: Partial<InsertContract>): Promise<Contract | undefined> {
    const contract = this.contracts.get(id);
    if (!contract) return undefined;
    
    const updated = { ...contract, ...update };
    this.contracts.set(id, updated);

    // Update property availability if contract status changed
    if (update.isActive !== undefined) {
      const property = this.properties.get(contract.propertyId);
      if (property) {
        this.properties.set(contract.propertyId, { ...property, isAvailable: !update.isActive });
      }
    }

    return updated;
  }

  async deleteContract(id: number): Promise<boolean> {
    const contract = this.contracts.get(id);
    if (contract) {
      // Make property available again
      const property = this.properties.get(contract.propertyId);
      if (property) {
        this.properties.set(contract.propertyId, { ...property, isAvailable: true });
      }
    }
    return this.contracts.delete(id);
  }

  // Payments
  async getPayment(id: number): Promise<Payment | undefined> {
    return this.payments.get(id);
  }

  async getPayments(): Promise<Payment[]> {
    return Array.from(this.payments.values());
  }

  async getPaymentsWithDetails(): Promise<PaymentWithDetails[]> {
    const payments = Array.from(this.payments.values());
    const result: PaymentWithDetails[] = [];

    for (const payment of payments) {
      const tenant = this.tenants.get(payment.tenantId);
      const contract = this.contracts.get(payment.contractId);
      
      if (tenant && contract) {
        const property = this.properties.get(contract.propertyId);
        if (property) {
          result.push({
            ...payment,
            tenant,
            contract: {
              ...contract,
              property,
            },
          });
        }
      }
    }

    return result;
  }

  async getPaymentsByContract(contractId: number): Promise<Payment[]> {
    return Array.from(this.payments.values()).filter(p => p.contractId === contractId);
  }

  async getPendingPayments(): Promise<PaymentWithDetails[]> {
    const paymentsWithDetails = await this.getPaymentsWithDetails();
    return paymentsWithDetails.filter(p => p.status === "pending" || p.status === "overdue");
  }

  async getOverduePayments(): Promise<PaymentWithDetails[]> {
    const paymentsWithDetails = await this.getPaymentsWithDetails();
    const now = new Date();
    return paymentsWithDetails.filter(p => 
      (p.status === "pending" || p.status === "overdue") && 
      new Date(p.dueDate) < now
    );
  }

  async createPayment(insertPayment: InsertPayment): Promise<Payment> {
    const id = this.currentId++;
    const payment: Payment = {
      ...insertPayment,
      id,
      createdAt: new Date(),
    };
    this.payments.set(id, payment);
    return payment;
  }

  async updatePayment(id: number, update: Partial<InsertPayment>): Promise<Payment | undefined> {
    const payment = this.payments.get(id);
    if (!payment) return undefined;
    
    const updated = { ...payment, ...update };
    this.payments.set(id, updated);
    return updated;
  }

  async deletePayment(id: number): Promise<boolean> {
    return this.payments.delete(id);
  }

  async getDashboardStats(): Promise<{
    totalTenants: number;
    activeProperties: number;
    monthlyIncome: number;
    pendingPayments: number;
  }> {
    const totalTenants = this.tenants.size;
    const activeProperties = Array.from(this.properties.values()).filter(p => !p.isAvailable).length;
    
    const activeContracts = Array.from(this.contracts.values()).filter(c => c.isActive);
    const monthlyIncome = activeContracts.reduce((sum, contract) => 
      sum + parseFloat(contract.monthlyRent), 0
    );

    const pendingPayments = Array.from(this.payments.values()).filter(p => 
      p.status === "pending" || p.status === "overdue"
    ).length;

    return {
      totalTenants,
      activeProperties,
      monthlyIncome,
      pendingPayments,
    };
  }
}

export const storage = new MemStorage();
