import { MenuItem } from "@/app/page";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { DeleteConfirmationModal } from "./delete-confirmation-modal";
import Image from "next/image";

interface MenuGridProps {
  items: MenuItem[];
  onDeleteItem: (id: string) => void;
}

export function MenuGrid({ items, onDeleteItem }: MenuGridProps) {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<MenuItem | null>(null);

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
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="bg-card text-card-foreground rounded-lg border border-border/40 shadow-sm overflow-hidden transition-all hover:scale-105 hover:shadow-md hover:border-border/80"
          >
            <div className="relative h-48">
              <Image
                src="/images/food-placeholder.jpg"
                alt={item.name}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                priority={false}
              />
              <Button
                variant="destructive"
                size="icon"
                className="absolute top-2 right-2 h-8 w-8"
                onClick={() => handleDeleteClick(item)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
            <div className="p-4">
              <h3 className="text-lg font-semibold mb-1">{item.name}</h3>
              <p className="text-muted-foreground mb-2">{item.price}</p>
              <p className="text-sm text-muted-foreground line-clamp-2">
                {item.description}
              </p>
            </div>
          </div>
        ))}
      </div>

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
    </>
  );
}
