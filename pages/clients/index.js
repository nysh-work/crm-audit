import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { clientsDatabase, getPersonnelById } from '../../utils/mockDatabase';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { FiUsers, FiPlus, FiSearch, FiFilter, FiStar, FiPhone, FiMail, FiPenTool } from 'react-icons/fi';

const ClientsPage = () => {
  const [clients, setClients] = useState([]);
  const [filteredClients, setFilteredClients] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortBy, setSortBy] = useState('clientName');
  const [sortOrder, setSortOrder] = useState('asc');
  
  // Initialize clients from database
  useEffect(() => {
    setClients(clientsDatabase);
    setFilteredClients(clientsDatabase);
  }, []);
  
  // Filter and sort clients when search term, filters, or sort options change
  useEffect(() => {
    let result = [...clients];
    
    // Apply status filter
    if (statusFilter !== 'all') {
      result = result.filter(client => client.status === statusFilter);
    }
    
    // Apply search filter
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(client =>
        client.clientName.toLowerCase().includes(term) ||
        client.CIN.toLowerCase().includes(term) ||
        client.PAN.toLowerCase().includes(term) ||
        client.sector.toLowerCase().includes(term)
      );
    }
    
    // Apply sorting
    result.sort((a, b) => {
      let comparison = 0;
      
      // Handle different sort fields
      if (sortBy === 'clientName') {
        comparison = a.clientName.localeCompare(b.clientName);
      } else if (sortBy === 'latestTurnover') {
        comparison = parseFloat(a.latestTurnover) - parseFloat(b.latestTurnover);
      } else if (sortBy === 'clientRating') {
        comparison = a.clientRating - b.clientRating;
      } else if (sortBy === 'relationshipStartDate') {
        comparison = new Date(a.relationshipStartDate) - new Date(b.relationshipStartDate);
      }
      
      // Apply sort order
      return sortOrder === 'asc' ? comparison : -comparison;
    });
    
    setFilteredClients(result);
  }, [clients, searchTerm, statusFilter, sortBy, sortOrder]);
  
  // Handle search term change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Get assigned team member names
  const getTeamMembers = (teamIds) => {
    if (!teamIds || teamIds.length === 0) return 'None';
    
    return teamIds.map(id => {
      const person = getPersonnelById(id);
      return person ? person.name : 'Unknown';
    }).join(', ');
  };
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Clients</h1>
            <p className="text-gray-600">Manage your clients and relationships</p>
          </div>
          <div>
            <Link href="/clients/new">
              <a className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors">
                <FiPlus className="mr-2" />
                Add New Client
              </a>
            </Link>
          </div>
        </div>
        
        {/* Search and Filter Bar */}
        <Card className="mb-6">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-grow">
                <div className="absolute left-3 top-3 text-gray-400">
                  <FiSearch />
                </div>
                <input
                  type="text"
                  placeholder="Search clients by name, CIN, PAN, or sector..."
                  className="pl-10 pr-4 py-2 border rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
              </div>
              
              <div className="flex gap-2">
                <div className="flex items-center">
                  <div className="flex items-center bg-white border rounded-md">
                    <div className="px-3 py-2 text-gray-400">
                      <FiFilter />
                    </div>
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-2 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="all">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Prospect">Prospects</option>
                      <option value="Former">Former</option>
                    </select>
                  </div>
                </div>
                
                <div className="flex items-center">
                  <div className="flex items-center bg-white border rounded-md">
                    <select
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value)}
                      className="px-3 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    >
                      <option value="clientName">Sort by Name</option>
                      <option value="latestTurnover">Sort by Turnover</option>
                      <option value="clientRating">Sort by Rating</option>
                      <option value="relationshipStartDate">Sort by Relationship Date</option>
                    </select>
                  </div>
                </div>
                
                <button
                  onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                  className="px-3 py-2 border rounded-md bg-white"
                >
                  {sortOrder === 'asc' ? '↑' : '↓'}
                </button>
              </div>
            </div>
          </CardContent>
        </Card>
        
        {/* Client List */}
        <div className="mb-8">
          {filteredClients.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map(client => (
                <Link key={client.id} href={`/clients/${client.id}`}>
                  <a className="block h-full">
                    <Card className="h-full hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-lg font-bold text-gray-800 mb-1">{client.clientName}</h3>
                            <div className="flex items-center space-x-1">
                              {[...Array(5)].map((_, i) => (
                                <FiStar
                                  key={i}
                                  className={`h-4 w-4 ${i < client.clientRating ? 'text-yellow-400 fill-current' : 'text-gray-300'}`}
                                />
                              ))}
                            </div>
                          </div>
                          <span className={`text-xs px-2 py-1 rounded-full ${
                            client.status === 'Active' ? 'bg-green-100 text-green-800' : 
                            client.status === 'Prospect' ? 'bg-blue-100 text-blue-800' : 
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {client.status}
                          </span>
                        </div>
                        
                        <div className="space-y-2 text-sm text-gray-600">
                          <div className="flex justify-between">
                            <span>Sector:</span>
                            <span className="font-medium">{client.sector}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Turnover:</span>
                            <span className="font-medium">₹{client.latestTurnover.toLocaleString()} Lakhs</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Relationship Since:</span>
                            <span className="font-medium">{client.relationshipStartDate}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Team:</span>
                            <span className="font-medium truncate max-w-[150px]" title={getTeamMembers(client.assignedTeam)}>
                              {getTeamMembers(client.assignedTeam)}
                            </span>
                          </div>
                        </div>
                        
                        <div className="mt-4 pt-4 border-t flex justify-between">
                          <button className="text-blue-600 flex items-center text-sm hover:text-blue-800">
                            <FiPhone className="mr-1" /> Contact
                          </button>
                          <button className="text-green-600 flex items-center text-sm hover:text-green-800">
                            <FiMail className="mr-1" /> Email
                          </button>
                          <button className="text-purple-600 flex items-center text-sm hover:text-purple-800">
                            <FiPenTool className="mr-1" /> Edit
                          </button>
                        </div>
                      </CardContent>
                    </Card>
                  </a>
                </Link>
              ))}
            </div>
          ) : (
            <div className="bg-white rounded-lg p-8 text-center">
              <FiUsers className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No clients found</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm ? 'Try adjusting your search or filters' : 'Get started by adding your first client'}
              </p>
              <Link href="/clients/new">
                <a className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
                  <FiPlus className="mr-2" /> Add New Client
                </a>
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ClientsPage; 