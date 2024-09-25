import type React from "react";
import { useState, useRef, type FormEvent, useEffect } from "react";
import type { StudentProps } from "../components/Student";

type Status = "editing" | "removable" | "idle" | "error";

export default function useStudent({
	id,
	name,
	onRemoveStudent,
	onEditStudentName,
}: StudentProps & {
	onRemoveStudent: (id: string) => void;
	onEditStudentName: (id: string, name: string) => void;
}) {
	// const [isEditing, setIsEditing] = useState(false);
	// const [showRemove, setShowRemove] = useState(false);
	const [editedName, setEditedName] = useState(name);
	const nameRef = useRef<HTMLInputElement>(null);
	const [status, setStatus] = useState<Status>("idle");
	const [error, setError] = useState("");

	const editing = status === "editing";
	const removable = status === "removable";
	const idle = status === "idle";

	// const removeIsVisible = showRemove && !isEditing;

	const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		const message =
			(value.length < 3 && "To short") ||
			(value.length > 10 && "To long") ||
			"";
		setError(message);
		setEditedName(value);
	};

	const handleNameSubmit = (e: FormEvent) => {
		e.preventDefault();
		if (error) return;
		onEditStudentName(id, editedName);
		// setIsEditing(false);
		nameRef.current?.blur();
	};

	// const resetCardState = () => {
	// 	// setIsEditing(false);
	// 	// setShowRemove(false);
	// 	updateStatus("idle");
	// };

	const onMouseMove = (e: React.MouseEvent) => {
		const target = e.target as HTMLElement;
		const rect = target.closest("article")?.getBoundingClientRect();
		if (!rect) return;
		const x = e.clientX - rect.left;
		//if (x > rect.width - 50 && !isEditing) setShowRemove(true);
		if (x > rect.width - 50 && !editing) updateStatus("removable");
	};

	// const activateEditModus = () => {
	// 	//setIsEditing(true);
	// };

	const removeStudent = async (id: string) => {
		onRemoveStudent(id);
	};

	const updateStatus = (newStatus: Status) => {
		setStatus(newStatus);
	};

	const removeHover = () => {
		//if (!isEditing) setShowRemove(false);
		if (!editing) setStatus("idle");
	};

	const input = {
		onBlur: () => updateStatus("idle"),
		onFocus: () => updateStatus("editing"),
		onChange: handleNameChange,
		value: editedName,
		ref: nameRef,
	};

	return {
		// isEditing,
		// removeIsVisible,
		// showRemove,
		// setShowRemove,
		// editedName,
		// handleNameChange,
		// nameRef,
		// resetCardState,
		// activateEditModus,
		// handleNameSubmit,
		// onMouseMove,
		// removeHover,
		// removeStudent,
		handlers: {
			submit: handleNameSubmit,
			move: onMouseMove,
			leave: removeHover,
			remove: removeStudent,
			input,
		},
		status: { editing, removable, idle, error },
	};
}
