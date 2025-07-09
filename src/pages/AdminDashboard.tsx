
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Shield, Building2, Users, MessageSquare, Phone, Mail, Eye, CheckCircle, XCircle, LogOut, Search } from "lucide-react";
import { Link } from "react-router-dom";
import { mockHostels } from "@/utils/mockData";
import { useToast } from "@/hooks/use-toast";

const AdminDashboard = () => {
  const [hostels, setHostels] = useState(mockHostels);
  const [searchTerm, setSearchTerm] = useState("");
  const { toast } = useToast();

  const pendingHostels = hostels.filter(h => !h.approved);
  const approvedHostels = hostels.filter(h => h.approved);

  const handleApprove = (hostelId: string) => {
    setHostels(prev => prev.map(h => 
      h.id === hostelId ? { ...h, approved: true } : h
    ));
    toast({
      title: "Hostel Approved",
      description: "The hostel is now visible to students.",
    });
  };

  const handleReject = (hostelId: string) => {
    setHostels(prev => prev.filter(h => h.id !== hostelId));
    toast({
      title: "Hostel Rejected",
      description: "The hostel has been removed from the system.",
      variant: "destructive"
    });
  };

  const filteredHostels = approvedHostels.filter(hostel =>
    hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hostel.ownerName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Admin Dashboard</h1>
              <p className="text-xs text-gray-600">Kyambogo Hostel Connect</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/">
              <Button variant="outline" size="sm">
                <Eye className="h-4 w-4 mr-2" />
                View Site
              </Button>
            </Link>
            <Link to="/admin">
              <Button variant="outline" size="sm">
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Hostels</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{hostels.length}</div>
              <p className="text-xs text-muted-foreground">
                {approvedHostels.length} approved
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingHostels.length}</div>
              <p className="text-xs text-muted-foreground">
                Awaiting approval
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Active Owners</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {[...new Set(hostels.map(h => h.ownerId))].length}
              </div>
              <p className="text-xs text-muted-foreground">
                Registered owners
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Room Types</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {hostels.reduce((sum, h) => sum + h.roomTypes.length, 0)}
              </div>
              <p className="text-xs text-muted-foreground">
                Available options
              </p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="approved" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="approved">Approved Hostels</TabsTrigger>
            <TabsTrigger value="pending" className="relative">
              Pending Review
              {pendingHostels.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs px-2 py-0 rounded-full">
                  {pendingHostels.length}
                </Badge>
              )}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="approved" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-800">Approved Hostels</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search hostels..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-4">
              {filteredHostels.map((hostel) => (
                <Card key={hostel.id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-semibold text-gray-800">{hostel.name}</h3>
                          <Badge className="bg-green-100 text-green-800">Approved</Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{hostel.location}</p>
                        <p className="text-gray-700 mb-4 line-clamp-2">{hostel.description}</p>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-800">Owner Details</h4>
                            <div className="text-sm text-gray-600">
                              <p className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                {hostel.ownerName}
                              </p>
                              <p className="flex items-center gap-2">
                                <Phone className="h-4 w-4" />
                                {hostel.ownerContact}
                              </p>
                            </div>
                          </div>
                          <div className="space-y-2">
                            <h4 className="font-medium text-gray-800">Hostel Info</h4>
                            <div className="text-sm text-gray-600">
                              <p>{hostel.roomTypes.length} Room Types</p>
                              <p>Added {hostel.createdAt}</p>
                            </div>
                          </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                          {hostel.roomTypes.map((room) => (
                            <Badge key={room.id} variant="outline" className="text-xs">
                              {room.price.toLocaleString()} UGX
                            </Badge>
                          ))}
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        <Link to={`/hostel/${hostel.id}`}>
                          <Button variant="outline" size="sm">
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Button>
                        </Link>
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={() => window.open(`tel:${hostel.ownerContact}`, '_blank')}
                        >
                          <Phone className="h-4 w-4 mr-1" />
                          Call
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredHostels.length === 0 && (
              <div className="text-center py-16">
                <Building2 className="h-16 w-16 mx-auto text-gray-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">No hostels found</h3>
                <p className="text-gray-500">Try adjusting your search criteria</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="pending" className="space-y-6">
            <h2 className="text-3xl font-bold text-gray-800">Pending Review</h2>

            {pendingHostels.length > 0 ? (
              <div className="space-y-4">
                {pendingHostels.map((hostel) => (
                  <Card key={hostel.id} className="border-orange-200 bg-orange-50">
                    <CardContent className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="text-xl font-semibold text-gray-800">{hostel.name}</h3>
                            <Badge className="bg-orange-100 text-orange-800">Pending</Badge>
                          </div>
                          <p className="text-gray-600 mb-3">{hostel.location}</p>
                          <p className="text-gray-700 mb-4">{hostel.description}</p>
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Owner Details</h4>
                              <div className="text-sm text-gray-600">
                                <p>{hostel.ownerName}</p>
                                <p>{hostel.ownerContact}</p>
                              </div>
                            </div>
                            <div>
                              <h4 className="font-medium text-gray-800 mb-2">Room Types</h4>
                              <div className="text-sm text-gray-600">
                                <p>{hostel.roomTypes.length} types available</p>
                                <p>Submitted {hostel.createdAt}</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="flex flex-col gap-2 ml-4">
                          <Button 
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => handleApprove(hostel.id)}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 hover:text-red-700 hover:border-red-300"
                            onClick={() => handleReject(hostel.id)}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <CheckCircle className="h-16 w-16 mx-auto text-green-400 mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">All caught up!</h3>
                <p className="text-gray-500">No hostels pending review at the moment</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
};

export default AdminDashboard;
