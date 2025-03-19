import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  clientsDatabase, 
  personnelDatabase, 
  tasksDatabase, 
  opportunitiesDatabase, 
  activitiesDatabase,
  getPersonnelById,
  getClientById,
  getRecentActivities,
  getUpcomingTasks
} from '../utils/mockDatabase';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '../components/ui/card';
import { FiUsers, FiCheckSquare, FiDollarSign, FiActivity, FiCalendar, FiPlus, FiBarChart } from 'react-icons/fi';

const CRMDashboard = () => {
  // Dashboard statistics
  const activeClients = clientsDatabase.filter(c => c.status === 'Active').length;
  const prospectClients = clientsDatabase.filter(c => c.status === 'Prospect').length;
  const pendingTasks = tasksDatabase.filter(t => t.status !== 'Completed').length;
  const upcomingFollowUps = activitiesDatabase.filter(a => 
    a.followUpRequired && new Date(a.followUpDate) > new Date()
  ).length;
  
  const pipelineValue = opportunitiesDatabase
    .filter(o => ['Qualified', 'Proposal Sent'].includes(o.status))
    .reduce((sum, opp) => sum + (opp.estimatedValue * opp.closingProbability / 100), 0);
  
  // Recent activities
  const recentActivities = getRecentActivities(5);
  
  // Upcoming tasks
  const upcomingTasks = getUpcomingTasks(5);
  
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">CRM Dashboard</h1>
            <p className="text-gray-600">Manage your client relationships and activities</p>
          </div>
          <div className="flex space-x-2">
            <Link href="/clients">
              <a className="bg-blue-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-blue-700 transition-colors">
                <FiUsers className="mr-2" />
                View All Clients
              </a>
            </Link>
          </div>
        </div>
        
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Active Clients</p>
                  <p className="text-3xl font-bold text-gray-800">{activeClients}</p>
                </div>
                <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center">
                  <FiUsers className="text-blue-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Prospects</p>
                  <p className="text-3xl font-bold text-gray-800">{prospectClients}</p>
                </div>
                <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center">
                  <FiDollarSign className="text-green-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pipeline Value</p>
                  <p className="text-3xl font-bold text-gray-800">₹{Math.round(pipelineValue).toLocaleString()}</p>
                </div>
                <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center">
                  <FiBarChart className="text-purple-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium text-gray-500">Pending Tasks</p>
                  <p className="text-3xl font-bold text-gray-800">{pendingTasks}</p>
                </div>
                <div className="h-12 w-12 bg-yellow-100 rounded-full flex items-center justify-center">
                  <FiCheckSquare className="text-yellow-600 h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-800 mb-3">Quick Actions</h2>
          <div className="flex flex-wrap gap-3">
            <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors flex items-center">
              <FiPlus className="mr-2" /> Add Client
            </button>
            <button className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center">
              <FiPlus className="mr-2" /> Log Activity
            </button>
            <button className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors flex items-center">
              <FiPlus className="mr-2" /> Create Task
            </button>
            <button className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors flex items-center">
              <FiPlus className="mr-2" /> Add Opportunity
            </button>
          </div>
        </div>
        
        {/* Recent Activities & Tasks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          {/* Recent Activities */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                  <FiActivity className="mr-2 text-blue-600" /> Recent Activities
                </CardTitle>
                <Link href="/activities">
                  <a className="text-sm text-blue-600 hover:text-blue-800">View All</a>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {recentActivities.length > 0 ? (
                <div className="space-y-4">
                  {recentActivities.map(activity => {
                    const client = getClientById(activity.clientId);
                    const personnel = getPersonnelById(activity.createdBy);
                    return (
                      <div key={activity.id} className="border-b pb-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">
                            {activity.type} - {client?.clientName || 'Unknown Client'}
                          </h4>
                          <span className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">
                            {activity.date}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        <div className="flex justify-between mt-2 text-xs text-gray-500">
                          <span>By: {personnel?.name || 'Unknown'}</span>
                          {activity.followUpRequired && (
                            <span className="text-orange-600">
                              Follow-up: {activity.followUpDate}
                            </span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No recent activities found</p>
              )}
            </CardContent>
          </Card>
          
          {/* Upcoming Tasks */}
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                  <FiCalendar className="mr-2 text-purple-600" /> Upcoming Tasks
                </CardTitle>
                <Link href="/tasks">
                  <a className="text-sm text-blue-600 hover:text-blue-800">View All</a>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {upcomingTasks.length > 0 ? (
                <div className="space-y-4">
                  {upcomingTasks.map(task => {
                    const client = getClientById(task.clientId);
                    const assignee = getPersonnelById(task.assignedTo);
                    return (
                      <div key={task.id} className="border-b pb-3">
                        <div className="flex justify-between">
                          <h4 className="font-medium text-gray-800">{task.title}</h4>
                          <span className={`text-xs px-2 py-1 rounded ${
                            task.priority === 'High' ? 'bg-red-100 text-red-800' : 
                            task.priority === 'Medium' ? 'bg-yellow-100 text-yellow-800' : 
                            'bg-green-100 text-green-800'
                          }`}>
                            {task.priority}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                        <div className="flex justify-between mt-2 text-xs">
                          <span className="text-gray-500">
                            {client ? `For: ${client.clientName}` : 'General Task'}
                          </span>
                          <span className="text-blue-600">
                            Due: {task.dueDate}
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          Assigned to: {assignee?.name || 'Unassigned'}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-4">No upcoming tasks</p>
              )}
            </CardContent>
          </Card>
        </div>
        
        {/* Opportunities / Pipeline Section */}
        <div className="mb-8">
          <Card>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl flex items-center">
                  <FiDollarSign className="mr-2 text-green-600" /> Pipeline Overview
                </CardTitle>
                <Link href="/opportunities">
                  <a className="text-sm text-blue-600 hover:text-blue-800">View All</a>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {/* Opportunity Pipeline Visualization */}
                <div className="grid grid-cols-4 gap-2 mb-6">
                  <div className="bg-gray-100 p-4 rounded-md text-center">
                    <h5 className="font-medium text-gray-700 mb-2">Lead</h5>
                    <div className="text-2xl font-bold text-gray-800">
                      {opportunitiesDatabase.filter(o => o.status === 'Lead').length}
                    </div>
                  </div>
                  <div className="bg-blue-100 p-4 rounded-md text-center">
                    <h5 className="font-medium text-gray-700 mb-2">Qualified</h5>
                    <div className="text-2xl font-bold text-gray-800">
                      {opportunitiesDatabase.filter(o => o.status === 'Qualified').length}
                    </div>
                  </div>
                  <div className="bg-purple-100 p-4 rounded-md text-center">
                    <h5 className="font-medium text-gray-700 mb-2">Proposal</h5>
                    <div className="text-2xl font-bold text-gray-800">
                      {opportunitiesDatabase.filter(o => o.status === 'Proposal Sent').length}
                    </div>
                  </div>
                  <div className="bg-green-100 p-4 rounded-md text-center">
                    <h5 className="font-medium text-gray-700 mb-2">Won</h5>
                    <div className="text-2xl font-bold text-gray-800">
                      {opportunitiesDatabase.filter(o => o.status === 'Won').length}
                    </div>
                  </div>
                </div>
                
                {/* Latest Opportunities */}
                <h3 className="text-lg font-medium text-gray-800 mb-3">Latest Opportunities</h3>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Value (₹)</th>
                        <th className="px-3 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Probability</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {opportunitiesDatabase.slice(0, 5).map(opp => {
                        const client = getClientById(opp.clientId);
                        return (
                          <tr key={opp.id}>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm font-medium text-gray-900">{opp.name}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <div className="text-sm text-gray-500">{client?.clientName || 'Unknown'}</div>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap">
                              <span className={`inline-flex text-xs leading-5 font-semibold rounded-full px-2 py-1 ${
                                opp.status === 'Proposal Sent' ? 'bg-yellow-100 text-yellow-800' : 
                                opp.status === 'Qualified' ? 'bg-blue-100 text-blue-800' : 
                                opp.status === 'Won' ? 'bg-green-100 text-green-800' : 
                                'bg-gray-100 text-gray-800'
                              }`}>
                                {opp.status}
                              </span>
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {opp.estimatedValue.toLocaleString()}
                            </td>
                            <td className="px-3 py-2 whitespace-nowrap text-sm text-gray-500">
                              {opp.closingProbability}%
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CRMDashboard; 