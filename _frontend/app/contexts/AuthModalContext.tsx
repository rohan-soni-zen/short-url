import React, { createContext, useContext, useState } from "react";

export type AuthModalType = "login" | "register" | null;

interface AuthModalContextType {
	openModal: AuthModalType;
	openLoginModal: () => void;
	openRegisterModal: () => void;
	closeModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(
	undefined
);

interface AuthModalProviderProps {
	children: React.ReactNode;
}

export function AuthModalProvider({ children }: AuthModalProviderProps) {
	const [openModal, setOpenModal] = useState<AuthModalType>(null);

	const openLoginModal = () => setOpenModal("login");
	const openRegisterModal = () => setOpenModal("register");
	const closeModal = () => setOpenModal(null);

	return (
		<AuthModalContext.Provider
			value={{
				openModal,
				openLoginModal,
				openRegisterModal,
				closeModal,
			}}
		>
			{children}
		</AuthModalContext.Provider>
	);
}

export function useAuthModal() {
	const context = useContext(AuthModalContext);
	if (context === undefined) {
		throw new Error(
			"useAuthModal must be used within an AuthModalProvider"
		);
	}
	return context;
}
