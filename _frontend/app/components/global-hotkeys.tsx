import { useHotkeys } from "react-hotkeys-hook";
import { useQuickCreate } from "~/contexts/QuickCreateContext";

export function GlobalHotkeys() {
	const { openModal } = useQuickCreate();

	// Add global hotkey for Quick Create (Ctrl+K or Cmd+K)
	useHotkeys(
		"ctrl+k, meta+k",
		event => {
			event.preventDefault();
			openModal();
		},
		{
			enableOnFormTags: false, // Disable in form inputs
			preventDefault: true,
		}
	);

	return null; // This component doesn't render anything
}
