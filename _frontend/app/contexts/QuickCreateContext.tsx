import React, { createContext, useContext, useState } from "react";

interface QuickCreateContextType {
	isOpen: boolean;
	openModal: () => void;
	closeModal: () => void;
	setIsOpen: (open: boolean) => void;
}

const QuickCreateContext = createContext<QuickCreateContextType | undefined>(
	undefined
);

interface QuickCreateProviderProps {
	children: React.ReactNode;
}

export function QuickCreateProvider({ children }: QuickCreateProviderProps) {
	const [isOpen, setIsOpen] = useState(false);

	const openModal = () => setIsOpen(true);
	const closeModal = () => setIsOpen(false);

	return (
		<QuickCreateContext.Provider
			value={{
				isOpen,
				openModal,
				closeModal,
				setIsOpen,
			}}
		>
			{children}
		</QuickCreateContext.Provider>
	);
}

export function useQuickCreate() {
	const context = useContext(QuickCreateContext);
	if (context === undefined) {
		throw new Error(
			"useQuickCreate must be used within a QuickCreateProvider"
		);
	}
	return context;
}
