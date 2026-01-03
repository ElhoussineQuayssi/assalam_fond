import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export const ListBlockEditor = ({ heading, items = [], onChange }) => {
  // Ensure items is always an array
  const safeItems = Array.isArray(items) ? items : [];

  const handleHeadingChange = (value) => {
    onChange({ heading: value, items: safeItems });
  };

  const handleAddItem = () => {
    const newItem = {
      title: "",
      description: "",
    };
    onChange({
      heading,
      items: [...safeItems, newItem],
    });
  };

  const handleRemoveItem = (index) => {
    const updatedItems = safeItems.filter((_, i) => i !== index);
    onChange({ heading, items: updatedItems });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = safeItems.map((item, i) =>
      i === index ? { ...item, [field]: value } : item,
    );
    onChange({ heading, items: updatedItems });
  };

  const handleMoveItem = (index, direction) => {
    const newIndex = direction === "up" ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= safeItems.length) return;

    const updatedItems = [...safeItems];
    [updatedItems[index], updatedItems[newIndex]] = [
      updatedItems[newIndex],
      updatedItems[index],
    ];
    onChange({ heading, items: updatedItems });
  };

  return (
    <div className="space-y-6">
      {/* List Heading */}
      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
          List Heading
        </label>
        <Input
          value={heading || ""}
          onChange={(e) => handleHeadingChange(e.target.value)}
          placeholder="Enter list heading..."
          className="w-full"
        />
      </div>

      {/* List Items */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">
            List Items
          </label>
          <Button
            type="button"
            onClick={handleAddItem}
            size="sm"
            className="flex items-center gap-1"
          >
            <Plus size={14} />
            Add Item
          </Button>
        </div>

        {safeItems.length === 0 ? (
          <div className="text-center py-8 text-slate-500 dark:text-slate-400">
            No items yet. Click "Add Item" to create your first list item.
          </div>
        ) : (
          <div className="space-y-3">
            {safeItems.map((item, index) => (
              <div
                key={index}
                className="p-4 border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-800"
              >
                {/* Item Header */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Item {index + 1}
                  </span>
                  <div className="flex items-center gap-1">
                    <Button
                      type="button"
                      onClick={() => handleMoveItem(index, "up")}
                      size="sm"
                      variant="outline"
                      disabled={index === 0}
                    >
                      <ChevronUp size={14} />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleMoveItem(index, "down")}
                      size="sm"
                      variant="outline"
                      disabled={index === safeItems.length - 1}
                    >
                      <ChevronDown size={14} />
                    </Button>
                    <Button
                      type="button"
                      onClick={() => handleRemoveItem(index)}
                      size="sm"
                      variant="outline"
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </div>

                {/* Item Fields */}
                <div className="space-y-3">
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Item Title
                    </label>
                    <Input
                      value={item.title || ""}
                      onChange={(e) =>
                        handleItemChange(index, "title", e.target.value)
                      }
                      placeholder="Enter item title..."
                      className="w-full"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                      Description
                    </label>
                    <Textarea
                      value={item.description || ""}
                      onChange={(e) =>
                        handleItemChange(index, "description", e.target.value)
                      }
                      placeholder="Enter item description..."
                      className="w-full"
                      rows={2}
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
