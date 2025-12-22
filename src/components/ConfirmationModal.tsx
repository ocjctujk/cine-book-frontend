import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Modal from "@mui/material/Modal";
import Stack from "@mui/material/Stack";

const style = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
  borderRadius: 2, // optional: nicer look
};

type ConfirmationModalProps = {
  open: boolean;
  onClose: () => void; // for closing without action (e.g., backdrop click or ESC)
  onConfirm: () => void; // called when user clicks "Yes" (confirm cancellation)
  onCancel: () => void; // called when user clicks "No" (keep seats)
};

export default function ConfirmationModal({
  open,
  onClose,
  onConfirm,
  onCancel,
}: ConfirmationModalProps) {
  const handleNo = () => {
    onCancel();
    onClose(); // close the modal
  };

  const handleYes = () => {
    onConfirm();
    onClose(); // close the modal
  };

  return (
    <Modal
      open={open}
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Are you sure you want to cancel?
        </Typography>
        <Typography id="modal-modal-description" sx={{ mt: 2, mb: 4 }}>
          Your seats will be available for other users.
        </Typography>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" onClick={handleNo}>
            No
          </Button>
          <Button variant="contained" color="error" onClick={handleYes}>
            Yes
          </Button>
        </Stack>
      </Box>
    </Modal>
  );
}
