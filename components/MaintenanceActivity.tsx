import React, { useState, useEffect } from "react";
import { Card, CardContent, Typography, Box, Button, Modal } from "@mui/material";
import { useRouter } from "next/router";
import { Activity, fetchBlocks } from "@/services/firebaseService";
import ActivityStatus from "@/components/layout/ActivityStatus";
import EditActivityModal from "./EditActivityModal"; // Import do modal EditActivityModal

interface MaintenanceActivityProps {
  activity: Activity;
  onUpdate: (updatedActivity: Activity) => void;
  onRemove?: (activityId: number) => void;
  removeValid: boolean;
  titleUpdate: string;
}

const MaintenanceActivity: React.FC<MaintenanceActivityProps> = ({
  activity,
  onUpdate,
  onRemove,
  removeValid,
  titleUpdate,
}) => {
  const [removeOpen, setRemoveOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [blocks, setBlocks] = useState<{ id: string; name: string }[]>([]);

  const router = useRouter();

  useEffect(() => {
    const loadBlocks = async () => {
      const fetchedBlocks = await fetchBlocks();
      setBlocks(fetchedBlocks || []);
    };
    loadBlocks();
  }, []);

  const handleOpenModal = (activity: Activity) => {
    setSelectedActivity(activity);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedActivity(null);
    setModalOpen(false);
  };

  const handleRemoveOpen = () => setRemoveOpen(true);
  const handleRemoveClose = () => setRemoveOpen(false);

  const handleHistoryOpen = () => {
    router.push(`/activity/${activity.id}`);
  };

  const handleRemove = () => {
    if (onRemove) {
      onRemove(activity.id);
    }
    handleRemoveClose();
  };

  // Função para formatar a data para o formato dia/mês/ano
  const formatDate = (dateString: string): string => {
    const [year, month, day] = dateString.split("-");
    return `${day}/${month}/${year}`;
  };

  return (
    <>
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography variant="h5" component="div">
            {activity.titulo}{" "}
            <ActivityStatus
              activity={{
                ...activity,
                data: activity.data || "",
                category_id: activity.category_id ?? 0,
              }}
            />
          </Typography>
          <Typography sx={{ mb: 1.5 }} color="text.secondary">
            {activity.atividade}
          </Typography>
          <Typography variant="body2">
            <strong>Responsável:</strong> {activity.responsavel}
          </Typography>
          <Typography variant="body2">
            <strong>Periodicidade:</strong> {activity.Periodicidade}
          </Typography>

          {Array.isArray(activity.blocoIDs) && activity.blocoIDs.length > 0 && (
            <Typography variant="body2">
              <strong>Blocos:</strong>{" "}
              {activity.blocoIDs
                .map(
                  (blockId) =>
                    blocks.find((block) => block.id === blockId)?.name
                )
                .filter((name) => name)
                .join(", ")}
            </Typography>
          )}

          {activity.data && (
            <>
            {console.log(activity)}
              <Typography variant="body2">
                Última manutenção: {formatDate(activity.data) || "Carregando..."}
              </Typography>
              <Typography variant="body2">
                Próxima manutenção: {activity.dueDate}
              </Typography>
            </>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 2,
              flexDirection: { xs: "column", sm: "row" },
              gap: 2,
            }}
          >
            <Button
              variant="contained"
              color="primary"
              onClick={() => handleOpenModal(activity)}
            >
              {titleUpdate}
            </Button>
            {activity.data && (
              <Button
                variant="contained"
                color="info"
                onClick={handleHistoryOpen}
              >
                Histórico de Alterações
              </Button>
            )}
            {removeValid && (
              <Button
                variant="contained"
                color="secondary"
                onClick={handleRemoveOpen}
              >
                Remover
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>

      {/* Modal de Edição */}
      {selectedActivity && (
        <EditActivityModal
          open={modalOpen}
          activity={selectedActivity}
          onClose={handleCloseModal}
          onActivityUpdated={() => onUpdate(selectedActivity)}
          isEdit={true}
          showNotApplicable={true}
        />
      )}

      {/* Modal de Remoção */}
      <Modal open={removeOpen} onClose={handleRemoveClose}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6" component="h2">
            Confirmar Remoção
          </Typography>
          <Typography variant="body2" sx={{ my: 2 }}>
            Você tem certeza que deseja remover esta atividade?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
            <Button
              variant="contained"
              color="secondary"
              onClick={handleRemoveClose}
            >
              Cancelar
            </Button>
            <Button variant="contained" color="primary" onClick={handleRemove}>
              Remover
            </Button>
          </Box>
        </Box>
      </Modal>
    </>
  );
};

export default MaintenanceActivity;
