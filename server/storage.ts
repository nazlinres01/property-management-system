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
    this.seedData();
  }

  private seedData() {
    // Sample Landlords - Different types of property owners
    const landlords = [
      {
        name: "Mehmet Öztürk",
        email: "mehmet.ozturk@email.com",
        phone: "+90 532 123 4567",
        nationalId: "12345678901",
        address: "Beşiktaş, İstanbul",
        bankAccount: "TR33 0006 1005 1978 6457 8413 26",
        taxNumber: "1234567890"
      },
      {
        name: "Fatma Yılmaz",
        email: "fatma.yilmaz@email.com",
        phone: "+90 533 234 5678",
        nationalId: "23456789012",
        address: "Kadıköy, İstanbul",
        bankAccount: "TR64 0004 6007 8888 8006 2330 01",
        taxNumber: "2345678901"
      },
      {
        name: "Ahmet Emlak A.Ş.",
        email: "info@ahmetemlak.com",
        phone: "+90 212 345 6789",
        nationalId: "34567890123",
        address: "Şişli, İstanbul",
        bankAccount: "TR52 0001 2009 4520 0058 0015 02",
        taxNumber: "3456789012"
      },
      {
        name: "Zeynep Koç",
        email: "zeynep.koc@gmail.com",
        phone: "+90 534 345 6789",
        nationalId: "45678901234",
        address: "Çankaya, Ankara",
        bankAccount: "TR89 0001 5001 5800 7300 0135 64",
        taxNumber: "4567890123"
      }
    ];

    landlords.forEach(landlord => {
      const id = this.currentId++;
      this.landlords.set(id, {
        ...landlord,
        id,
        createdAt: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000)
      });
    });

    // Sample Tenants - Different demographics
    const tenants = [
      {
        name: "Ali Demir",
        email: "ali.demir@email.com",
        phone: "+90 535 456 7890",
        nationalId: "56789012345",
        address: "Beşiktaş, İstanbul",
        emergencyContact: "Ayşe Demir",
        emergencyPhone: "+90 532 987 6543"
      },
      {
        name: "Elif Kaya",
        email: "elif.kaya@email.com",
        phone: "+90 536 567 8901",
        nationalId: "67890123456",
        address: "Kadıköy, İstanbul",
        emergencyContact: "Murat Kaya",
        emergencyPhone: "+90 533 876 5432"
      },
      {
        name: "Burak Şahin",
        email: "burak.sahin@email.com",
        phone: "+90 537 678 9012",
        nationalId: "78901234567",
        address: "Şişli, İstanbul",
        emergencyContact: "Seda Şahin",
        emergencyPhone: "+90 534 765 4321"
      },
      {
        name: "Merve Yıldız",
        email: "merve.yildiz@email.com",
        phone: "+90 538 789 0123",
        nationalId: "89012345678",
        address: "Çankaya, Ankara",
        emergencyContact: "Can Yıldız",
        emergencyPhone: "+90 535 654 3210"
      },
      {
        name: "Emre Arslan",
        email: "emre.arslan@email.com",
        phone: "+90 539 890 1234",
        nationalId: "90123456789",
        address: "Konak, İzmir",
        emergencyContact: "Deniz Arslan",
        emergencyPhone: "+90 536 543 2109"
      }
    ];

    tenants.forEach(tenant => {
      const id = this.currentId++;
      this.tenants.set(id, {
        ...tenant,
        id,
        createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000)
      });
    });

    // Sample Properties - Various types and locations
    const properties = [
      {
        type: "Daire",
        address: "Barbaros Bulvarı No:45 D:8, Beşiktaş/İstanbul",
        landlordId: 1,
        monthlyRent: "25000",
        area: 120,
        floor: 8,
        hasBalcony: true,
        hasParking: true,
        isAvailable: false,
        deposit: "50000",
        description: "Deniz manzaralı, merkezi konumda 2+1 daire. Metro ve otobüs duraklarına yakın."
      },
      {
        type: "Daire",
        address: "Bağdat Caddesi No:123 D:4, Kadıköy/İstanbul",
        landlordId: 2,
        monthlyRent: "22000",
        area: 100,
        floor: 4,
        hasBalcony: true,
        hasParking: false,
        isAvailable: false,
        deposit: "44000",
        description: "Cadde üzeri, eşyalı 2+1 daire. Alışveriş merkezlerine yürüme mesafesi."
      },
      {
        type: "Ofis",
        address: "Büyükdere Caddesi No:78 Kat:12, Şişli/İstanbul",
        landlordId: 3,
        monthlyRent: "45000",
        area: 200,
        floor: 12,
        hasBalcony: false,
        hasParking: true,
        isAvailable: false,
        deposit: "90000",
        description: "Plaza içinde modern ofis. 24 saat güvenlik ve resepsiyon hizmeti."
      },
      {
        type: "Daire",
        address: "Tunalı Hilmi Caddesi No:67 D:6, Çankaya/Ankara",
        landlordId: 4,
        monthlyRent: "18000",
        area: 110,
        floor: 6,
        hasBalcony: true,
        hasParking: true,
        isAvailable: false,
        deposit: "36000",
        description: "Merkezi konumda 3+1 daire. Doğalgaz, asansör, güvenlik mevcut."
      },
      {
        type: "Daire",
        address: "Alsancak Mah. 1453 Sokak No:12 D:3, Konak/İzmir",
        landlordId: 1,
        monthlyRent: "16000",
        area: 85,
        floor: 3,
        hasBalcony: true,
        hasParking: false,
        isAvailable: true,
        deposit: "32000",
        description: "Denize yakın 2+1 daire. Klimalı, beyaz eşyalı."
      },
      {
        type: "Dükkan",
        address: "İstiklal Caddesi No:234, Beyoğlu/İstanbul",
        landlordId: 2,
        monthlyRent: "35000",
        area: 60,
        floor: 0,
        hasBalcony: false,
        hasParking: false,
        isAvailable: true,
        deposit: "70000",
        description: "Yoğun cadde üzeri dükkan. Yüksek insan trafiği, ticaret için ideal."
      }
    ];

    properties.forEach(property => {
      const id = this.currentId++;
      this.properties.set(id, {
        ...property,
        id,
        createdAt: new Date(Date.now() - Math.random() * 120 * 24 * 60 * 60 * 1000)
      });
    });

    // Sample Contracts - Active and historical rentals
    const contracts = [
      {
        landlordId: 1,
        tenantId: 1,
        propertyId: 1,
        monthlyRent: "25000",
        startDate: new Date("2024-03-01"),
        endDate: new Date("2025-03-01"),
        deposit: "50000",
        isActive: true,
        terms: "12 aylık kira sözleşmesi. Kira ödemeleri her ayın 5'inde yapılacaktır. Depozito sözleşme bitiminde iade edilecektir."
      },
      {
        landlordId: 2,
        tenantId: 2,
        propertyId: 2,
        monthlyRent: "22000",
        startDate: new Date("2024-01-15"),
        endDate: new Date("2025-01-15"),
        deposit: "44000",
        isActive: true,
        terms: "12 aylık kira sözleşmesi. Eşyalar kiracı sorumluluğundadır. Hasar durumunda onarım kiracıya aittir."
      },
      {
        landlordId: 3,
        tenantId: 3,
        propertyId: 3,
        monthlyRent: "45000",
        startDate: new Date("2024-02-01"),
        endDate: new Date("2026-02-01"),
        deposit: "90000",
        isActive: true,
        terms: "24 aylık ticari kira sözleşmesi. KDV dahil değildir. Ofis kullanımı için uygundur."
      },
      {
        landlordId: 4,
        tenantId: 4,
        propertyId: 4,
        monthlyRent: "18000",
        startDate: new Date("2024-04-01"),
        endDate: new Date("2025-04-01"),
        deposit: "36000",
        isActive: true,
        terms: "12 aylık kira sözleşmesi. Aidat ev sahibi tarafından ödenecektir. Doğalgaz faturası kiracıya aittir."
      },
      {
        landlordId: 1,
        tenantId: 5,
        propertyId: 5,
        monthlyRent: "16000",
        startDate: new Date("2023-09-01"),
        endDate: new Date("2024-09-01"),
        deposit: "32000",
        isActive: false,
        terms: "12 aylık kira sözleşmesi tamamlandı. Sözleşme yenilenmedi."
      },
      {
        landlordId: 2,
        tenantId: 1,
        propertyId: 6,
        monthlyRent: "35000",
        startDate: new Date("2024-06-01"),
        endDate: new Date("2025-06-01"),
        deposit: "70000",
        isActive: false,
        terms: "Ticari dükkan kirası. Kiracı tarafından erken feshedildi."
      }
    ];

    contracts.forEach(contract => {
      const id = this.currentId++;
      this.contracts.set(id, {
        id,
        landlordId: contract.landlordId,
        tenantId: contract.tenantId,
        propertyId: contract.propertyId,
        monthlyRent: contract.monthlyRent,
        startDate: contract.startDate,
        endDate: contract.endDate,
        deposit: contract.deposit ?? null,
        isActive: contract.isActive ?? null,
        terms: contract.terms ?? null,
        createdAt: new Date(contract.startDate)
      });
    });

    // Sample Payments - Comprehensive payment history
    const payments = [
      // Historical paid payments - October 2024
      {
        status: "paid",
        tenantId: 1,
        contractId: 1,
        amount: "25000",
        dueDate: new Date("2024-10-05"),
        paidDate: new Date("2024-10-03"),
        paymentMethod: "Banka Transferi",
        notes: "Zamanında ödendi"
      },
      {
        status: "paid",
        tenantId: 2,
        contractId: 2,
        amount: "22000",
        dueDate: new Date("2024-10-05"),
        paidDate: new Date("2024-10-07"),
        paymentMethod: "EFT",
        notes: "2 gün geç ödendi"
      },
      {
        status: "paid",
        tenantId: 3,
        contractId: 3,
        amount: "45000",
        dueDate: new Date("2024-10-01"),
        paidDate: new Date("2024-09-28"),
        paymentMethod: "Havale",
        notes: "Erken ödeme yapıldı"
      },
      {
        status: "paid",
        tenantId: 4,
        contractId: 4,
        amount: "18000",
        dueDate: new Date("2024-10-05"),
        paidDate: new Date("2024-10-05"),
        paymentMethod: "Otomatik Ödeme",
        notes: "Banka otomatik ödemesi"
      },
      // November 2024 payments
      {
        status: "paid",
        tenantId: 1,
        contractId: 1,
        amount: "25000",
        dueDate: new Date("2024-11-05"),
        paidDate: new Date("2024-11-03"),
        paymentMethod: "Banka Transferi",
        notes: "Zamanında ödendi"
      },
      {
        status: "paid",
        tenantId: 3,
        contractId: 3,
        amount: "45000",
        dueDate: new Date("2024-11-01"),
        paidDate: new Date("2024-10-30"),
        paymentMethod: "Çek",
        notes: "Erken ödeme - çek ile"
      },
      {
        status: "paid",
        tenantId: 4,
        contractId: 4,
        amount: "18000",
        dueDate: new Date("2024-11-05"),
        paidDate: new Date("2024-11-05"),
        paymentMethod: "Otomatik Ödeme",
        notes: "Banka otomatik ödemesi"
      },
      // Late payment in November
      {
        status: "overdue",
        tenantId: 2,
        contractId: 2,
        amount: "22000",
        dueDate: new Date("2024-11-05"),
        paidDate: null,
        paymentMethod: null,
        notes: "Geç ödeme - kiracı ile iletişim kuruldu. 15 gün gecikme"
      },
      // December 2024 - Current period
      {
        status: "pending",
        tenantId: 1,
        contractId: 1,
        amount: "25000",
        dueDate: new Date("2024-12-05"),
        paidDate: null,
        paymentMethod: null,
        notes: "Aralık ayı kirası - ödeme bekleniyor"
      },
      {
        status: "pending",
        tenantId: 3,
        contractId: 3,
        amount: "45000",
        dueDate: new Date("2024-12-01"),
        paidDate: null,
        paymentMethod: null,
        notes: "Ofis kirası - vadesi geçti"
      },
      {
        status: "pending",
        tenantId: 4,
        contractId: 4,
        amount: "18000",
        dueDate: new Date("2024-12-05"),
        paidDate: null,
        paymentMethod: null,
        notes: "Otomatik ödeme ayarlandı"
      },
      // September 2024 - Historical payments
      {
        status: "paid",
        tenantId: 1,
        contractId: 1,
        amount: "25000",
        dueDate: new Date("2024-09-05"),
        paidDate: new Date("2024-09-04"),
        paymentMethod: "Nakit",
        notes: "Nakit ödeme - makbuz kesildi"
      },
      {
        status: "paid",
        tenantId: 2,
        contractId: 2,
        amount: "22000",
        dueDate: new Date("2024-09-05"),
        paidDate: new Date("2024-09-20"),
        paymentMethod: "EFT",
        notes: "15 gün geç ödendi - gecikme faizi alınmadı"
      },
      {
        status: "paid",
        tenantId: 3,
        contractId: 3,
        amount: "45000",
        dueDate: new Date("2024-09-01"),
        paidDate: new Date("2024-08-30"),
        paymentMethod: "Havale",
        notes: "Erken ödeme yapıldı"
      },
      // Partial payment example
      {
        status: "paid",
        tenantId: 5,
        contractId: 5,
        amount: "8000",
        dueDate: new Date("2024-09-01"),
        paidDate: new Date("2024-09-15"),
        paymentMethod: "EFT",
        notes: "Sözleşme feshi nedeniyle kısmi ödeme"
      }
    ];

    payments.forEach(payment => {
      const id = this.currentId++;
      this.payments.set(id, {
        id,
        status: payment.status,
        tenantId: payment.tenantId,
        contractId: payment.contractId,
        amount: payment.amount,
        dueDate: payment.dueDate,
        paidDate: payment.paidDate ?? null,
        paymentMethod: payment.paymentMethod ?? null,
        notes: payment.notes ?? null,
        createdAt: new Date(payment.dueDate.getTime() - 30 * 24 * 60 * 60 * 1000)
      });
    });
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
      id,
      type: insertProperty.type,
      address: insertProperty.address,
      landlordId: insertProperty.landlordId,
      monthlyRent: insertProperty.monthlyRent,
      area: insertProperty.area ?? null,
      floor: insertProperty.floor ?? null,
      hasBalcony: insertProperty.hasBalcony ?? null,
      hasParking: insertProperty.hasParking ?? null,
      isAvailable: insertProperty.isAvailable ?? null,
      deposit: insertProperty.deposit ?? null,
      description: insertProperty.description ?? null,
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
      id,
      landlordId: insertContract.landlordId,
      tenantId: insertContract.tenantId,
      propertyId: insertContract.propertyId,
      monthlyRent: insertContract.monthlyRent,
      startDate: insertContract.startDate,
      endDate: insertContract.endDate,
      deposit: insertContract.deposit ?? null,
      isActive: insertContract.isActive ?? null,
      terms: insertContract.terms ?? null,
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
      id,
      status: insertPayment.status,
      tenantId: insertPayment.tenantId,
      contractId: insertPayment.contractId,
      amount: insertPayment.amount,
      dueDate: insertPayment.dueDate,
      paidDate: insertPayment.paidDate ?? null,
      paymentMethod: insertPayment.paymentMethod ?? null,
      notes: insertPayment.notes ?? null,
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
