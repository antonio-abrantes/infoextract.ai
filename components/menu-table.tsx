import { MenuItem } from "@/app/page";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Modal } from "@/components/ui/modal";
import { useState } from "react";
import { PencilIcon } from "@heroicons/react/24/outline";
import { ChangeEvent } from 'react';
import { Trash2 } from "lucide-react";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";

interface MenuTableProps {
  items: MenuItem[];
  onUpdateItem: (updatedItem: MenuItem) => void;
  onDeleteItem: (id: string) => void;
}

export function MenuTable({ items, onUpdateItem, onDeleteItem }: MenuTableProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

  const handleEdit = (item: MenuItem) => {
    const completeItem = {
      ...item,
      codigo: item.codigo || '',
      category: item.category || '',
    };
    setEditingItem(completeItem);
    setIsModalOpen(true);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingItem) {
      onUpdateItem(editingItem);
      setIsModalOpen(false);
      setEditingItem(null);
    }
  };

  const handleDeleteClick = (item: MenuItem) => {
    setItemToDelete(item);
    setDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (itemToDelete) {
      onDeleteItem(itemToDelete.id);
    }
    setDeleteModalOpen(false);
    setItemToDelete(null);
  };

  return (
    <div className="w-full">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-border">
              <th className="py-4 px-6 font-semibold text-foreground">Code</th>
              <th className="py-4 px-6 font-semibold text-foreground">Name</th>
              <th className="py-4 px-6 font-semibold text-foreground">Category</th>
              <th className="py-4 px-6 font-semibold text-foreground">Price</th>
              <th className="py-4 px-6 font-semibold text-foreground">Description</th>
              <th className="py-4 px-6 font-semibold text-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => (
              <tr 
                key={item.id} 
                className="border-b border-border hover:bg-accent hover:text-accent-foreground transition-colors"
              >
                <td className="py-4 px-6">{item.codigo || '-'}</td>
                <td className="py-4 px-6">{item.name}</td>
                <td className="py-4 px-6">{item.category || '-'}</td>
                <td className="py-4 px-6">{item.price}</td>
                <td className="py-4 px-6 max-w-xs truncate">{item.description}</td>
                <td className="py-4 px-6">
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(item)}
                      className="h-8 w-8"
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => handleDeleteClick(item)}
                      className="h-8 w-8"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Edit Item"
        description="Edit the menu item information"
      >
        {editingItem && (
          <form onSubmit={handleSave} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Code</label>
              <Input
                value={editingItem.codigo}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, codigo: e.target.value })
                }
                placeholder="Enter the item code"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Name</label>
              <Input
                value={editingItem.name}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, name: e.target.value })
                }
                placeholder="Enter the item name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Category</label>
              <Input
                value={editingItem.category}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, category: e.target.value })
                }
                placeholder="Enter the item category"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Price</label>
              <Input
                value={editingItem.price}
                onChange={(e) =>
                  setEditingItem({ ...editingItem, price: e.target.value })
                }
                placeholder="Enter the item price"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Description</label>
              <Textarea
                value={editingItem.description}
                onChange={(e: ChangeEvent<HTMLTextAreaElement>) =>
                  setEditingItem({ ...editingItem, description: e.target.value })
                }
                placeholder="Enter the item description"
              />
            </div>
            <div className="flex justify-end space-x-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        )}
      </Modal>

      {itemToDelete && (
        <DeleteConfirmationModal
          isOpen={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false);
            setItemToDelete(null);
          }}
          onConfirm={handleConfirmDelete}
          itemName={itemToDelete.name}
        />
      )}
    </div>
  );
} 