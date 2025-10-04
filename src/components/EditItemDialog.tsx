import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Item } from "@/types/api";

interface EditItemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: Item | null;
  onSubmit: (data: { name: string; description: string; available: boolean }) => void;
  onDelete: () => void;
}

export const EditItemDialog = ({ open, onOpenChange, item, onSubmit, onDelete }: EditItemDialogProps) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [available, setAvailable] = useState(true);

  useEffect(() => {
    if (item) {
      setName(item.name);
      setDescription(item.description);
      setAvailable(item.available);
    }
  }, [item]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !description.trim()) return;

    onSubmit({ name, description, available });
    onOpenChange(false);
  };

  const handleDelete = () => {
    if (window.confirm('Вы уверены, что хотите удалить эту вещь?')) {
      onDelete();
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Редактировать вещь</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Название</Label>
            <Input
              id="edit-name"
              placeholder="Например: Велосипед горный"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-description">Описание</Label>
            <Textarea
              id="edit-description"
              placeholder="Опишите вещь подробнее..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="edit-available">Доступно для обмена</Label>
            <Switch
              id="edit-available"
              checked={available}
              onCheckedChange={setAvailable}
            />
          </div>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button 
              type="button" 
              variant="destructive" 
              onClick={handleDelete}
              className="sm:mr-auto"
            >
              Удалить
            </Button>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Отмена
            </Button>
            <Button type="submit">Сохранить</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
