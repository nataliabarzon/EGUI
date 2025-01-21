'use client';

import { useState, useEffect } from 'react';
import * as Toast from "@radix-ui/react-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const API_URL = 'https://egui.onrender.com';

const PROFILE_PICTURES = [
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1633332755192-727a05c4013d?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop'
];

export function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingUser, setEditingUser] = useState(null);
  const [toast, setToast] = useState({ open: false, title: '', description: '', variant: 'default' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const showToast = (title, description, variant = 'default') => {
    setToast({ open: true, title, description, variant });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, open: false }));
  };

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/users`);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      const usersWithPictures = data.map((user) => ({
        ...user   
         }));
      setUsers(usersWithPictures);
    } catch (err) {
      setError(err.message || 'An error occurred');
      showToast('Error', 'Failed to fetch users', 'destructive');
    } finally {
      setLoading(false);
    }
  };



  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    try {
      const response = await fetch(`${API_URL}/users/${editingUser.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editingUser)
      });
      if (!response.ok) throw new Error('Failed to update user');
      await fetchUsers();
      setEditingUser(null);
      showToast('Success', 'User updated successfully');
    } catch (err) {
      showToast('Error', err.message || 'Failed to update user', 'destructive');
    }
  };

  const handleDeleteUser = async (id) => {
    console.log('delete user', id);
    try {
      const response = await fetch(`${API_URL}/users/${id}`, { method: 'DELETE',  headers: { 'Content-Type': 'application/json' }, });
      if (!response.ok) throw new Error('Failed to delete user');
      await fetchUsers();
      showToast('Success', 'User deleted successfully');
    } catch (err) {
      showToast('Error', err.message || 'Failed to delete user', 'destructive');
    }
  };

  if (loading) return <p className="text-center text-xl mt-8">Loading users...</p>;
  if (error) return <p className="text-center text-xl mt-8 text-red-500">Error: {error}</p>;

  return (
    <Toast.Provider swipeDirection="right">
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold mb-6">User Management</h1>

      
        <Card>
          <CardHeader>
            <CardTitle>User List</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Profile</TableHead>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <Avatar>
                        <AvatarImage src={user.profilePicture} alt={user.name} />
                        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell>{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>{user.role}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button variant="outline" size="sm" onClick={() => setEditingUser(user)}>
                              Edit
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit User</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleUpdateUser} className="space-y-4">
                              <div>
                                <Label htmlFor="edit-name">Name</Label>
                                <Input
                                  id="edit-name"
                                  value={editingUser?.name || ''}
                                  onChange={(e) => setEditingUser((prev) => prev ? { ...prev, name: e.target.value } : null)}
                                  required
                                />
                              </div>
                          
                              <div>
                                <Label htmlFor="edit-email">Email</Label>
                                <Input
                                  id="edit-email"
                                  type="email"
                                  value={editingUser?.email || ''}
                                  onChange={(e) => setEditingUser((prev) => prev ? { ...prev, email: e.target.value } : null)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-role">Role</Label>
                                <Input
                                  id="edit-role"
                                  value={editingUser?.role || ''}
                                  onChange={(e) => setEditingUser((prev) => prev ? { ...prev, role: e.target.value } : null)}
                                  required
                                />
                              </div>
                              <div>
                                <Label htmlFor="edit-password">Password</Label>
                                <Input
                                  id="edit-password"
                                  value={editingUser?.password || ''}
                                  placeholder="Enter new password"
                                  type="password"
                                  className="w-[30%]" // Limits the input to a maximum of 5 characters (dots in password fields)

                                  onChange={(e) => setEditingUser((prev) => prev ? { ...prev, password: e.target.value } : null)}
                                  required
                                />
                              </div>
                            </form>
                            <DialogFooter>
                              <Button type="submit" onClick={handleUpdateUser}>Save Changes</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Button 
                          variant="destructive" 
                          size="sm" 
                          onClick={() => handleDeleteUser(user.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Toast.Root
          open={toast.open}
          onOpenChange={hideToast}
          className={`${
            toast.variant === 'destructive' ? 'bg-red-600' : 'bg-green-600'
          } text-white p-4 rounded shadow-lg`}
        >
          <Toast.Title className="font-semibold">{toast.title}</Toast.Title>
          <Toast.Description>{toast.description}</Toast.Description>
          <Toast.Action className="absolute top-2 right-2" asChild altText="Close">
            <button onClick={hideToast} className="text-white">
              X
            </button>
          </Toast.Action>
        </Toast.Root>
        <Toast.Viewport className="fixed bottom-0 right-0 flex flex-col p-6 gap-2 w-full max-w-sm m-0 list-none z-50" />
      </div>
    </Toast.Provider>
  );
}
