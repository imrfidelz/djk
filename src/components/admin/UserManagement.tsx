
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Filter, Users, User, Edit, Eye, Plus, Check } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Drawer, DrawerClose, DrawerContent, DrawerFooter, DrawerHeader, DrawerTitle } from '@/components/ui/drawer';
import { Skeleton } from '@/components/ui/skeleton';
import { User as UserType, UserFormValues, CreateUserRequest, UpdateUserRequest } from './types/user.types';
import { userService } from '@/services/userService';
import UserForm from './user/components/UserForm';
import DeleteConfirmation from './user/components/DeleteConfirmation';
import AddUserButton from './user/components/AddUserButton';

const UserManagement = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedUser, setSelectedUser] = useState<UserType | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  // Fetch users
  const { data: usersResponse, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: userService.getUsers,
  });

  // Create user mutation
  const createUserMutation = useMutation({
    mutationFn: userService.createUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsAddDialogOpen(false);
      toast({
        title: "User Created",
        description: "User has been created successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to create user.",
        variant: "destructive",
      });
    },
  });

  // Update user mutation
  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserRequest }) => 
      userService.updateUser(id, data),
    onSuccess: (response) => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsEditDialogOpen(false);
      if (drawerOpen) {
        setSelectedUser(response.data);
      } else {
        setSelectedUser(null);
      }
      toast({
        title: "User Updated",
        description: "User has been updated successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to update user.",
        variant: "destructive",
      });
    },
  });

  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: userService.deleteUser,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['users'] });
      setIsDeleteDialogOpen(false);
      setDrawerOpen(false);
      setSelectedUser(null);
      toast({
        title: "User Deleted",
        description: "User has been deleted successfully.",
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.response?.data?.error || "Failed to delete user.",
        variant: "destructive",
      });
    },
  });

  const users = usersResponse?.data || [];

  // Transform user data for display
  const transformedUsers = users.map(user => ({
    ...user,
    id: user._id,
    registeredDate: new Date(user.createdAt).toLocaleDateString(),
    lastLogin: '-', // This would need to be tracked separately
    orderCount: 0, // This would need to be calculated from orders
    totalSpent: 0, // This would need to be calculated from orders
    status: 'active' as const, // This would need to be a field in the backend
  }));

  // Filter function for search
  const filterUsers = (users: any[], query: string) => {
    if (!query) return users;
    return users.filter(user => 
      user.name.toLowerCase().includes(query.toLowerCase()) ||
      user.email.toLowerCase().includes(query.toLowerCase()) ||
      user.userName.toLowerCase().includes(query.toLowerCase())
    );
  };

  const handleViewUser = (user: UserType) => {
    setSelectedUser(user);
    setDrawerOpen(true);
  };

  const handleAddUser = (userData: UserFormValues) => {
    const createData: CreateUserRequest = {
      name: userData.name,
      email: userData.email,
      userName: userData.userName,
      phoneNumber: userData.phoneNumber,
      role: userData.role,
      bio: userData.bio,
      password: userData.password || 'defaultPassword123', // Should be required in form
    };
    createUserMutation.mutate(createData);
  };

  const handleEditUser = (userData: UserFormValues) => {
    if (selectedUser) {
      const updateData: UpdateUserRequest = {
        name: userData.name,
        email: userData.email,
        userName: userData.userName,
        phoneNumber: userData.phoneNumber,
        role: userData.role,
        bio: userData.bio,
      };
      updateUserMutation.mutate({ id: selectedUser._id, data: updateData });
    }
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser._id);
    }
  };

  const openEditDialog = (user: UserType) => {
    setSelectedUser(user);
    setIsEditDialogOpen(true);
  };

  const openDeleteDialog = (user: UserType) => {
    setSelectedUser(user);
    setIsDeleteDialogOpen(true);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500">Active</Badge>;
      case 'inactive':
        return <Badge variant="outline">Inactive</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-luxury-gold">Admin</Badge>;
      case 'vendor':
        return <Badge className="bg-blue-500">Vendor</Badge>;
      case 'user':
        return <Badge>User</Badge>;
      default:
        return <Badge variant="outline">{role}</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <Card>
          <CardContent className="p-6">
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="text-center py-8">
          <p className="text-red-500">Error loading users: {error.message}</p>
          <Button 
            onClick={() => queryClient.invalidateQueries({ queryKey: ['users'] })}
            className="mt-4"
          >
            Retry
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif">User Management</h1>
          <p className="text-muted-foreground">View and manage user accounts</p>
        </div>
        
        <AddUserButton onClick={() => setIsAddDialogOpen(true)} />
      </div>
      
      <div className="flex flex-col md:flex-row gap-4 justify-between mb-6">
        <div className="w-full md:w-2/3">
          <Input 
            placeholder="Search by name, email, or username..." 
            className="w-full"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <Button variant="outline" className="flex items-center gap-2">
          <Filter size={16} />
          Filter Users
        </Button>
      </div>
      
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="all" className="flex items-center">
            <Users size={16} className="mr-2" />
            All Users ({transformedUsers.length})
          </TabsTrigger>
          <TabsTrigger value="users">
            Users ({transformedUsers.filter(u => u.role === 'user').length})
          </TabsTrigger>
          <TabsTrigger value="vendors">
            Vendors ({transformedUsers.filter(u => u.role === 'vendor').length})
          </TabsTrigger>
          <TabsTrigger value="admins">
            Admins ({transformedUsers.filter(u => u.role === 'admin').length})
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>All Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Registered</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers(transformedUsers, searchQuery).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>@{user.userName}</TableCell>
                      <TableCell>{getRoleBadge(user.role)}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.registeredDate}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="users" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Users</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers(transformedUsers.filter(user => user.role === 'user'), searchQuery).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>@{user.userName}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="vendors" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Vendors</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers(transformedUsers.filter(user => user.role === 'vendor'), searchQuery).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>@{user.userName}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>{user.phoneNumber || '-'}</TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="admins" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Administrators</CardTitle>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Username</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>2FA Enabled</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filterUsers(transformedUsers.filter(user => user.role === 'admin'), searchQuery).map((user) => (
                    <TableRow key={user._id}>
                      <TableCell className="font-medium">{user.name}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>@{user.userName}</TableCell>
                      <TableCell>{getStatusBadge(user.status)}</TableCell>
                      <TableCell>
                        {user.isTwoFactorEnabled ? (
                          <Badge className="bg-green-500">Enabled</Badge>
                        ) : (
                          <Badge variant="outline">Disabled</Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right space-x-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewUser(user)}>
                          <Eye size={16} className="mr-1" />
                          View
                        </Button>
                        <Button variant="outline" size="sm" onClick={() => openEditDialog(user)}>
                          <Edit size={16} className="mr-1" />
                          Edit
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* User Detail Drawer */}
      <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
        <DrawerContent>
          <DrawerHeader>
            <DrawerTitle className="flex items-center">
              <User className="mr-2" size={20} />
              User Profile
              <div className="ml-auto flex items-center gap-2">
                {selectedUser && getRoleBadge(selectedUser.role)}
                {selectedUser && getStatusBadge(selectedUser.status)}
              </div>
            </DrawerTitle>
          </DrawerHeader>
          
          {selectedUser && (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-medium mb-2">Personal Information</h3>
                  <p className="text-xl font-semibold">{selectedUser.name}</p>
                  <p className="text-muted-foreground">@{selectedUser.userName}</p>
                  <p>{selectedUser.email}</p>
                  {selectedUser.phoneNumber && <p>{selectedUser.phoneNumber}</p>}
                </div>
                
                <div>
                  <h3 className="font-medium mb-2">Account Details</h3>
                  <p className="text-sm text-muted-foreground">Role: {selectedUser.role}</p>
                  <p className="text-sm text-muted-foreground">
                    2FA: {selectedUser.isTwoFactorEnabled ? 'Enabled' : 'Disabled'}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Registered: {selectedUser.registeredDate}
                  </p>
                </div>
              </div>
              
              {selectedUser.bio && (
                <div>
                  <h3 className="font-medium mb-2">Bio</h3>
                  <p className="text-muted-foreground">{selectedUser.bio}</p>
                </div>
              )}
              
              <div className="flex justify-end gap-2 pt-6">
                <Button variant="outline" size="sm" onClick={() => openEditDialog(selectedUser)}>
                  <Edit className="mr-2" size={16} />
                  Edit User
                </Button>
                <Button 
                  variant="outline" 
                  className="border-red-500 text-red-500" 
                  size="sm"
                  onClick={() => openDeleteDialog(selectedUser)}
                >
                  Delete User
                </Button>
              </div>
            </div>
          )}
          
          <DrawerFooter>
            <DrawerClose asChild>
              <Button variant="outline">Close</Button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
      
      {/* Add/Edit User Form Dialog */}
      <UserForm 
        user={selectedUser}
        isOpen={isAddDialogOpen || isEditDialogOpen} 
        onClose={() => {
          setIsAddDialogOpen(false);
          setIsEditDialogOpen(false);
          setSelectedUser(null);
        }}
        onSubmit={isAddDialogOpen ? handleAddUser : handleEditUser}
        isEditing={isEditDialogOpen}
      />
      
      {/* Delete User Confirmation */}
      <DeleteConfirmation 
        isOpen={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
        onConfirm={handleDeleteUser}
        userName={selectedUser?.name || ''}
      />
    </div>
  );
};

export default UserManagement;
