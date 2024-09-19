export interface  BlockDialogProps {
    open: boolean;
    isEditing: boolean;
    blockName: string;
    onClose: () => void;
    onSave: () => void;
    setBlockName: (name: string) => void;
    isViewing: boolean;
    loading: boolean; // Adicione a propriedade loading aqui

  }