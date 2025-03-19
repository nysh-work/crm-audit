/**
 * Mock client and personnel database for demonstration purposes
 * In a production environment, this would be replaced with API calls to a real database
 */

// Sample client database
export const clientsDatabase = [
  {
    id: 1,
    clientName: "ABC Manufacturing Ltd.",
    CIN: "L12345MH2010PLC123456",
    PAN: "ABCDE1234F",
    paidUpCapital: 1500,
    latestTurnover: 8500,
    borrowings: 2500,
    netProfit: 950,
    sector: "Manufacturing",
    clientType: "Private Company",
    // CRM-specific fields
    status: "Active", // Active, Prospect, Former
    assignedTeam: [101, 201], // Personnel IDs
    relationshipStartDate: "2020-05-15",
    clientRating: 4, // 1-5 rating
    referralSource: "Existing Client Referral",
    lastInteractionDate: "2023-12-10",
    notes: "Strategic client with expansion plans for FY24"
  },
  {
    id: 2,
    clientName: "XYZ Technology Solutions Pvt. Ltd.",
    CIN: "U67890MH2015PTC234567",
    PAN: "XYZAB5678G",
    paidUpCapital: 800,
    latestTurnover: 4500,
    borrowings: 1200,
    netProfit: 620,
    sector: "Information Technology",
    clientType: "Private Company",
    // CRM-specific fields
    status: "Active",
    assignedTeam: [102, 202],
    relationshipStartDate: "2019-08-22",
    clientRating: 5,
    referralSource: "Partner Network",
    lastInteractionDate: "2023-12-05",
    notes: "High-growth tech client with international expansion"
  },
  {
    id: 3,
    clientName: "Global Finance India Ltd.",
    CIN: "L34567MH2008PLC345678",
    PAN: "GLOFI7890H",
    paidUpCapital: 5000,
    latestTurnover: 25000,
    borrowings: 12000,
    netProfit: 3500,
    sector: "Financial Services",
    clientType: "List Company",
    // CRM-specific fields
    status: "Active",
    assignedTeam: [101, 203],
    relationshipStartDate: "2016-11-30",
    clientRating: 4,
    referralSource: "Industry Event",
    lastInteractionDate: "2023-11-28",
    notes: "Complex regulatory environment, requires specialized attention"
  },
  {
    id: 4,
    clientName: "Green Energy Solutions LLP",
    CIN: "AAB-1234",
    PAN: "GRENE9012I",
    paidUpCapital: 300,
    latestTurnover: 1800,
    borrowings: 450,
    netProfit: 220,
    sector: "Renewable Energy",
    clientType: "LLP",
    // CRM-specific fields
    status: "Prospect",
    assignedTeam: [103, 202],
    relationshipStartDate: "2023-09-10",
    clientRating: 3,
    referralSource: "Website Inquiry",
    lastInteractionDate: "2023-12-01",
    notes: "Interested in comprehensive audit and tax services"
  },
  {
    id: 5,
    clientName: "Healthcare Initiatives Trust",
    CIN: "NA",
    PAN: "HEALT1234J",
    paidUpCapital: 100,
    latestTurnover: 850,
    borrowings: 100,
    netProfit: 0,
    sector: "Healthcare",
    clientType: "Section 8 Company or Trust",
    // CRM-specific fields
    status: "Active",
    assignedTeam: [104, 203],
    relationshipStartDate: "2021-04-18",
    clientRating: 3,
    referralSource: "Community Outreach",
    lastInteractionDate: "2023-11-15",
    notes: "Non-profit with limited budget, pro-bono services provided"
  },
  {
    id: 6,
    clientName: "National Infrastructure Corporation",
    CIN: "L56789MH2000PLC456789",
    PAN: "NATIN5678K",
    paidUpCapital: 10000,
    latestTurnover: 45000,
    borrowings: 18000,
    netProfit: 5200,
    sector: "Infrastructure",
    clientType: "Public Company",
    // CRM-specific fields
    status: "Former",
    assignedTeam: [102, 201],
    relationshipStartDate: "2018-01-05",
    relationshipEndDate: "2022-07-30",
    clientRating: 2,
    referralSource: "Tender Process",
    lastInteractionDate: "2022-07-30",
    notes: "Relationship ended due to changes in management"
  },
  {
    id: 7,
    clientName: "Small Manufacturing Company",
    CIN: "U98765MH2018PTC567890",
    PAN: "SMALL9012L",
    paidUpCapital: 50,
    latestTurnover: 650,
    borrowings: 180,
    netProfit: 75,
    sector: "Manufacturing",
    clientType: "SMC Company",
    // CRM-specific fields
    status: "Prospect",
    assignedTeam: [103, 201],
    relationshipStartDate: "2023-11-05",
    clientRating: 4,
    referralSource: "Client Referral",
    lastInteractionDate: "2023-12-08",
    notes: "Small but growing business, high potential for long-term relationship"
  }
];

// Sample personnel database
export const personnelDatabase = [
  {
    id: 101,
    name: "Rajiv Sharma",
    membershipNumber: "M-12345",
    designation: "Partner, Engagement Partner",
    experience: 18,
    role: "partner",
    specialization: "Manufacturing, Retail",
    email: "rajiv.sharma@firm.com",
    phone: "+91 98765 43210",
    avatar: "/avatars/rajiv.jpg"
  },
  {
    id: 102,
    name: "Priya Mehta",
    membershipNumber: "M-23456",
    designation: "Partner, Engagement Partner",
    experience: 15,
    role: "partner",
    specialization: "Financial Services, Technology",
    email: "priya.mehta@firm.com",
    phone: "+91 98765 43211",
    avatar: "/avatars/priya.jpg"
  },
  {
    id: 103,
    name: "Amit Kapoor",
    membershipNumber: "M-34567",
    designation: "Partner, Concurring Partner",
    experience: 16,
    role: "partner",
    specialization: "Healthcare, Infrastructure",
    email: "amit.kapoor@firm.com",
    phone: "+91 98765 43212",
    avatar: "/avatars/amit.jpg"
  },
  {
    id: 104,
    name: "Deepa Jain",
    membershipNumber: "M-45678",
    designation: "Partner, Concurring Partner",
    experience: 14,
    role: "partner",
    specialization: "Technology, Energy",
    email: "deepa.jain@firm.com",
    phone: "+91 98765 43213",
    avatar: "/avatars/deepa.jpg"
  },
  {
    id: 201,
    name: "Rahul Gupta",
    membershipNumber: "M-56789",
    designation: "Audit Manager",
    experience: 8,
    role: "manager",
    specialization: "Manufacturing, Retail",
    email: "rahul.gupta@firm.com",
    phone: "+91 98765 43214",
    avatar: "/avatars/rahul.jpg"
  },
  {
    id: 202,
    name: "Neha Singh",
    membershipNumber: "M-67890",
    designation: "Audit Manager",
    experience: 7,
    role: "manager",
    specialization: "Financial Services, Technology",
    email: "neha.singh@firm.com",
    phone: "+91 98765 43215",
    avatar: "/avatars/neha.jpg"
  },
  {
    id: 203,
    name: "Vikram Malhotra",
    membershipNumber: "M-78901",
    designation: "Audit Manager",
    experience: 9,
    role: "manager",
    specialization: "Healthcare, Infrastructure",
    email: "vikram.malhotra@firm.com",
    phone: "+91 98765 43216",
    avatar: "/avatars/vikram.jpg"
  }
];

// Contact database for client contacts (CRM feature)
export const contactsDatabase = [
  {
    id: 1,
    clientId: 1,
    name: "Suresh Patel",
    position: "CFO",
    email: "suresh.patel@abcmanufacturing.com",
    phone: "+91 98765 12345",
    isPrimary: true,
    lastContactDate: "2023-12-10",
    preferences: {
      communicationMethod: "email",
      meetingFrequency: "monthly"
    },
    notes: "Prefers early morning meetings, detail-oriented"
  },
  {
    id: 2,
    clientId: 1,
    name: "Anjali Sharma",
    position: "Financial Controller",
    email: "anjali.sharma@abcmanufacturing.com",
    phone: "+91 98765 12346",
    isPrimary: false,
    lastContactDate: "2023-11-28",
    preferences: {
      communicationMethod: "phone",
      meetingFrequency: "as-needed"
    },
    notes: "Main day-to-day contact for audit queries"
  },
  {
    id: 3,
    clientId: 2,
    name: "Vivek Khanna",
    position: "CEO",
    email: "vivek.khanna@xyztechnology.com",
    phone: "+91 98765 23456",
    isPrimary: true,
    lastContactDate: "2023-12-05",
    preferences: {
      communicationMethod: "video-call",
      meetingFrequency: "quarterly"
    },
    notes: "Very busy, prefer scheduled meetings with agenda in advance"
  },
  {
    id: 4,
    clientId: 2,
    name: "Ritu Verma",
    position: "Finance Director",
    email: "ritu.verma@xyztechnology.com",
    phone: "+91 98765 23457",
    isPrimary: false,
    lastContactDate: "2023-12-01",
    preferences: {
      communicationMethod: "email",
      meetingFrequency: "bi-weekly"
    },
    notes: "Technically proficient, quick responder to queries"
  },
  {
    id: 5,
    clientId: 3,
    name: "Rajesh Kumar",
    position: "CFO",
    email: "rajesh.kumar@globalfinance.com",
    phone: "+91 98765 34567",
    isPrimary: true,
    lastContactDate: "2023-11-28",
    preferences: {
      communicationMethod: "email",
      meetingFrequency: "monthly"
    },
    notes: "Ex-auditor, understands the process well"
  }
];

// Activities database for tracking client interactions (CRM feature)
export const activitiesDatabase = [
  {
    id: 1,
    clientId: 1,
    contactId: 1,
    type: "Meeting",
    date: "2023-12-10",
    description: "Quarterly review meeting",
    outcome: "Discussed additional tax planning services",
    followUpRequired: true,
    followUpDate: "2023-12-20",
    createdBy: 101,
    attachments: []
  },
  {
    id: 2,
    clientId: 1,
    contactId: 2,
    type: "Call",
    date: "2023-11-28",
    description: "Audit planning discussion",
    outcome: "Scheduled preliminary fieldwork dates",
    followUpRequired: false,
    createdBy: 201,
    attachments: []
  },
  {
    id: 3,
    clientId: 2,
    contactId: 3,
    type: "Email",
    date: "2023-12-05",
    description: "Sent engagement letter for FY 2023-24",
    outcome: "Awaiting client signature",
    followUpRequired: true,
    followUpDate: "2023-12-12",
    createdBy: 102,
    attachments: ["engagement_letter_xyz_fy24.pdf"]
  },
  {
    id: 4,
    clientId: 3,
    contactId: 5,
    type: "Meeting",
    date: "2023-11-28",
    description: "Year-end planning meeting",
    outcome: "Agreed on timeline and deliverables",
    followUpRequired: true,
    followUpDate: "2023-12-15",
    createdBy: 101,
    attachments: ["meeting_notes.docx"]
  },
  {
    id: 5,
    clientId: 4,
    contactId: null,
    type: "Proposal",
    date: "2023-12-01",
    description: "Sent proposal for audit services",
    outcome: "Client reviewing the proposal",
    followUpRequired: true,
    followUpDate: "2023-12-08",
    createdBy: 103,
    attachments: ["green_energy_proposal.pdf"]
  }
];

// Tasks database for tracking to-dos and assignments (CRM feature)
export const tasksDatabase = [
  {
    id: 1,
    clientId: 1,
    title: "Prepare audit planning memo",
    description: "Draft initial audit planning memo for FY 2023-24",
    dueDate: "2023-12-20",
    priority: "High",
    status: "Pending",
    assignedTo: 201,
    createdBy: 101,
    relatedProposal: null
  },
  {
    id: 2,
    clientId: 1,
    title: "Schedule kick-off meeting",
    description: "Coordinate with client team for audit kick-off",
    dueDate: "2023-12-15",
    priority: "Medium",
    status: "Completed",
    completedDate: "2023-12-10",
    assignedTo: 201,
    createdBy: 101,
    relatedProposal: null
  },
  {
    id: 3,
    clientId: 2,
    title: "Follow up on engagement letter",
    description: "Call CFO to confirm receipt of engagement letter",
    dueDate: "2023-12-12",
    priority: "Medium",
    status: "In Progress",
    assignedTo: 202,
    createdBy: 102,
    relatedProposal: null
  },
  {
    id: 4,
    clientId: 4,
    title: "Prepare proposal revision",
    description: "Revise proposal based on client feedback",
    dueDate: "2023-12-10",
    priority: "High",
    status: "Pending",
    assignedTo: 103,
    createdBy: 103,
    relatedProposal: 1
  },
  {
    id: 5,
    clientId: null,
    title: "Team training on new tax regulations",
    description: "Organize internal training session on recent tax changes",
    dueDate: "2023-12-22",
    priority: "Low",
    status: "Pending",
    assignedTo: 102,
    createdBy: 102,
    relatedProposal: null
  }
];

// Opportunities database for tracking potential business (CRM feature)
export const opportunitiesDatabase = [
  {
    id: 1,
    clientId: 4,
    name: "Green Energy Solutions - Statutory Audit",
    status: "Proposal Sent",
    estimatedValue: 180000,
    proposalDate: "2023-12-01",
    closingProbability: 70,
    servicesIncluded: ["statutoryAudit", "taxAudit"],
    notes: "Prospect has shown strong interest in our industry expertise",
    nextSteps: "Follow up call scheduled for Dec 8",
    proposalId: 1
  },
  {
    id: 2,
    clientId: 7,
    name: "Small Manufacturing Company - Comprehensive Service Package",
    status: "Qualified",
    estimatedValue: 120000,
    proposalDate: null,
    closingProbability: 60,
    servicesIncluded: ["statutoryAudit", "taxAudit", "gstAnnualReturnFiling"],
    notes: "Meeting scheduled to discuss potential engagement scope",
    nextSteps: "Prepare initial proposal draft",
    proposalId: null
  },
  {
    id: 3,
    clientId: 1,
    name: "ABC Manufacturing - Additional Tax Advisory",
    status: "Qualified",
    estimatedValue: 75000,
    proposalDate: null,
    closingProbability: 80,
    servicesIncluded: ["taxAdvisory"],
    notes: "Current client interested in expanding services",
    nextSteps: "Meeting scheduled to discuss scope",
    proposalId: null
  },
  {
    id: 4,
    clientId: 2,
    name: "XYZ Technology - International Expansion Advisory",
    status: "Proposal Sent",
    estimatedValue: 250000,
    proposalDate: "2023-11-15",
    closingProbability: 65,
    servicesIncluded: ["internationalTax", "transferPricing"],
    notes: "Client expanding to US and Europe markets",
    nextSteps: "Follow up meeting scheduled for Dec 18",
    proposalId: 2
  }
];

/**
 * Get personnel by their role
 * @param {string} role - Role to filter by (e.g., 'partner', 'manager')
 * @returns {Array} - Filtered personnel array
 */
export const getPersonnelByRole = (role) => {
  return personnelDatabase.filter(person => person.role === role.toLowerCase());
};

/**
 * Get personnel by their ID
 * @param {number} id - Personnel ID
 * @returns {Object|null} - Personnel object or null if not found
 */
export const getPersonnelById = (id) => {
  return personnelDatabase.find(person => person.id === id) || null;
};

/**
 * Get client by their ID
 * @param {number} id - Client ID
 * @returns {Object|null} - Client object or null if not found
 */
export const getClientById = (id) => {
  return clientsDatabase.find(client => client.id === id) || null;
};

/**
 * Search clients by name, CIN, or PAN
 * @param {string} query - Search query
 * @returns {Array} - Filtered clients array
 */
export const searchClients = (query) => {
  if (!query) return [];
  
  const search = query.toLowerCase();
  return clientsDatabase.filter(client => 
    client.clientName.toLowerCase().includes(search) || 
    client.CIN.toLowerCase().includes(search) || 
    client.PAN.toLowerCase().includes(search)
  );
};

/**
 * Get client contacts
 * @param {number} clientId - Client ID
 * @returns {Array} - Contacts for the specified client
 */
export const getClientContacts = (clientId) => {
  return contactsDatabase.filter(contact => contact.clientId === clientId);
};

/**
 * Get client activities
 * @param {number} clientId - Client ID
 * @returns {Array} - Activities for the specified client
 */
export const getClientActivities = (clientId) => {
  return activitiesDatabase.filter(activity => activity.clientId === clientId)
    .sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Get client tasks
 * @param {number} clientId - Client ID
 * @returns {Array} - Tasks for the specified client
 */
export const getClientTasks = (clientId) => {
  return tasksDatabase.filter(task => task.clientId === clientId)
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate));
};

/**
 * Get client opportunities
 * @param {number} clientId - Client ID
 * @returns {Array} - Opportunities for the specified client
 */
export const getClientOpportunities = (clientId) => {
  return opportunitiesDatabase.filter(opp => opp.clientId === clientId);
};

/**
 * Get recent activities
 * @param {number} limit - Number of activities to return
 * @returns {Array} - Recent activities
 */
export const getRecentActivities = (limit = 5) => {
  return [...activitiesDatabase]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
};

/**
 * Get upcoming tasks
 * @param {number} limit - Number of tasks to return
 * @returns {Array} - Upcoming tasks
 */
export const getUpcomingTasks = (limit = 5) => {
  return tasksDatabase
    .filter(task => task.status !== 'Completed' && new Date(task.dueDate) > new Date())
    .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
    .slice(0, limit);
}; 