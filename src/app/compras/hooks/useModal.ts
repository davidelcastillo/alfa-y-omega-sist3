// src/app/compras/hooks/useModal.ts
"use client";
import { useState } from "react";

export default function useModal(defaultOpen = false) {
  const [open, setOpen] = useState(defaultOpen);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return { open, setOpen, openModal, closeModal };
}
