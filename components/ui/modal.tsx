"use client";

import { ReactNode } from "react";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
}

export function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    // Затемнений фон
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black/40 z-50 flex justify-center items-center"
    >
      {/* Контейнер модального вікна */}
      <div
        onClick={(e) => e.stopPropagation()} // Зупиняє закриття при кліку всередині вікна
        className="bg-white rounded-lg shadow-xl p-6 relative w-full max-w-lg"
      >
        {/* Кнопка закриття */}
        <button
          onClick={onClose}
          className="cursor-pointer absolute top-2 right-2 text-2xl text-gray-500 hover:text-gray-800"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
}
