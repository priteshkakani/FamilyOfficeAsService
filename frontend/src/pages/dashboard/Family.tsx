import { useState } from "react";
import { format } from "date-fns";
import { toast } from "react-hot-toast";
import { Plus, Loader2, Edit, Trash2, Users } from "lucide-react";
import { useFamilyMembers } from "../../components/profile/familyHooks";
import { Input } from "../../components/ui/input";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { Select, Option } from "../../components/ui/select";
import { Skeleton } from "../../components/ui/skeleton";

interface FamilyMember {
  id: string;
  user_id: string;
  name: string;
  relationship: string;
  date_of_birth?: string | null;
  created_at: string;
  updated_at: string;
}

type FamilyForm = Omit<FamilyMember, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

const RELATIONSHIPS = [
  'Spouse',
  'Child',
  'Parent',
  'Sibling',
  'Grandparent',
  'Grandchild',
  'Other',
];

const formatDate = (dateString?: string | null) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'PPP');
  } catch (e) {
    return dateString;
  }
};

const formatDateForInput = (dateString?: string | null) => {
  if (!dateString) return '';
  try {
    return format(new Date(dateString), 'yyyy-MM-dd');
  } catch (e) {
    return '';
  }
};

export default function Family() {
  // Using hooks from familyHooks
  const { 
    members = [], 
    isLoading, 
    error, 
    addMember,
    updateMember,
    deleteMember,
    isAdding,
    isUpdating,
    isDeleting
  } = useFamilyMembers();

  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState<FamilyForm>({
    name: '',
    relationship: '',
    date_of_birth: ''
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingId) {
        await updateMember({ id: editingId, ...formData });
      } else {
        await addMember(formData);
      }
      
      setIsFormOpen(false);
      setEditingId(null);
      setFormData({
        name: '',
        relationship: '',
        date_of_birth: ''
      });
    } catch (error) {
      console.error('Error saving family member:', error);
    }
  };

  const handleEdit = (member: FamilyMember) => {
    setEditingId(member.id);
    setFormData({
      name: member.name,
      relationship: member.relationship,
      date_of_birth: member.date_of_birth || ''
    });
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this family member?')) {
      try {
        await deleteMember(id);
      } catch (error) {
        console.error('Error deleting family member:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="p-4">
        <div className="space-y-4">
          <Skeleton className="h-8 w-1/3 mb-4" />
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-12 w-full" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600">
        Error loading family members: {error.message}
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Family Members</h2>
        <Button onClick={() => {
          setEditingId(null);
          setFormData({ name: '', relationship: '', date_of_birth: '' });
          setIsFormOpen(true);
        }}>
          <Plus className="mr-2 h-4 w-4" /> Add Family Member
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Family Members</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Relationship</TableHead>
                <TableHead>Date of Birth</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {members.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8 text-muted-foreground">
                    No family members added yet
                  </TableCell>
                </TableRow>
              ) : (
                members.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{member.relationship}</Badge>
                    </TableCell>
                    <TableCell>
                      {member.date_of_birth ? formatDate(member.date_of_birth) : 'Not specified'}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleEdit(member)}
                          disabled={isUpdating}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member.id)}
                          disabled={isDeleting}
                        >
                          <Trash2 className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add/Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle>{editingId ? 'Edit' : 'Add'} Family Member</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="text-sm font-medium">
                    Name
                  </label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="relationship" className="text-sm font-medium">
                    Relationship
                  </label>
                  <Select
                    name="relationship"
                    value={formData.relationship}
                    onChange={(e) =>
                      setFormData((prev) => ({ ...prev, relationship: e.target.value }))
                    }
                    required
                    className="w-full"
                  >
                    <option value="">Select relationship</option>
                    {RELATIONSHIPS.map((rel) => (
                      <Option key={rel} value={rel}>
                        {rel}
                      </Option>
                    ))}
                  </Select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="date_of_birth" className="text-sm font-medium">
                    Date of Birth (optional)
                  </label>
                  <Input
                    id="date_of_birth"
                    name="date_of_birth"
                    type="date"
                    value={formData.date_of_birth || ''}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="flex justify-end space-x-2 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsFormOpen(false);
                      setEditingId(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isAdding || isUpdating}>
                    {isAdding || isUpdating ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        {editingId ? 'Updating...' : 'Adding...'}
                      </>
                    ) : editingId ? (
                      'Update'
                    ) : (
                      'Add'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );

  if (!userId) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-gray-500">Please sign in to view family members</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Family Members</h1>
          <p className="text-muted-foreground">
            Manage your family members and their details
          </p>
        </div>
        <Button onClick={openAddModal} data-testid="add-family-member-btn">
          <Plus className="mr-2 h-4 w-4" />
          Add Family Member
        </Button>
      </div>

      {isMembersLoading ? (
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <Skeleton key={i} className="h-20 w-full rounded-lg" />
          ))}
        </div>
      ) : error ? (
        <Card>
          <CardHeader>
            <CardTitle className="text-destructive">Error</CardTitle>
            <CardDescription>
              {error.message || 'Failed to load family members'}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button variant="outline" onClick={() => window.location.reload()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      ) : members.length === 0 ? (
        <Card className="text-center p-8">
          <div className="flex flex-col items-center justify-center space-y-4">
            <Users className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-medium">No family members added yet</h3>
            <p className="text-sm text-muted-foreground">
              Get started by adding your first family member
            </p>
            <Button onClick={openAddModal} className="mt-4">
              <Plus className="mr-2 h-4 w-4" />
              Add Family Member
            </Button>
          </div>
        </Card>
      ) : (
        <>
          <Card>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Relationship</TableHead>
                  <TableHead>Date of Birth</TableHead>
                  <TableHead>Added On</TableHead>
                  <TableHead className="w-[100px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {pagedMembers.map((member) => (
                  <TableRow key={member.id}>
                    <TableCell className="font-medium">{member.name}</TableCell>
                    <TableCell>
                      <Badge variant="outline">
                        {member.relationship}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {member.date_of_birth ? formatDate(member.date_of_birth) : 'N/A'}
                    </TableCell>
                    <TableCell>{formatDate(member.created_at)}</TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => openEditModal(member)}
                          aria-label="Edit"
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(member.id)}
                          aria-label="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Card>

          {totalPages > 1 && (
            <div className="flex items-center justify-end space-x-2 py-4">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                data-testid="family-prev-page"
              >
                Previous
              </Button>
              <span className="text-sm text-muted-foreground">
                Page {page} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page >= totalPages}
                data-testid="family-next-page"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}

      {/* Add/Edit Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title={editingMember ? 'Edit Family Member' : 'Add Family Member'}
      >
        <form onSubmit={handleFormSubmit} className="space-y-4">
          {formError && (
            <div className="p-3 bg-red-100 text-red-700 rounded-md mb-4 text-sm">
              {formError}
            </div>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name">Full Name *</Label>
            <Input
              id="name"
              name="name"
              value={form.name}
              onChange={handleFormChange}
              placeholder="John Doe"
              required
            />
          </div>

          <div className="space-y-2">
            <Select
              label="Relationship *"
              name="relationship"
              value={form.relationship}
              onChange={handleSelectChange}
              required
            >
              <Option value="">Select relationship</Option>
              {RELATIONSHIPS.map((rel) => (
                <Option key={rel} value={rel.toLowerCase()}>
                  {rel}
                </Option>
              ))}
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date_of_birth">Date of Birth</Label>
            <Input
              type="date"
              id="date_of_birth"
              name="date_of_birth"
              value={form.date_of_birth || ''}
              onChange={handleFormChange}
              max={new Date().toISOString().split('T')[0]}
            />
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => setShowModal(false)}
              disabled={isMutating}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isMutating}>
              {isMutating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {editingMember ? 'Saving...' : 'Adding...'}
                </>
              ) : editingMember ? (
                'Save Changes'
              ) : (
                'Add Member'
              )}
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};
