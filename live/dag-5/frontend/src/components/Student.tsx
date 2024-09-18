import { useEffect, useRef, useState, type FormEvent } from "react";
import Avatar from "./Avatar";
import { X } from "lucide-react";
import classes from "./Student.module.css";

// export type StudentProps = {
//   id: string;
//   name: string;
// };

// const Student = ({ name }: StudentProps) => {
//   const avatar = name.split(" ").join("").toUpperCase().slice(0, 1);

//   return (
//     <div className="student">
//       <Avatar avatar={avatar} />
//       <p className="student-name">{name}</p>
//     </div>
//   );
// };

export type StudentProps = {
  id: string;
  name: string;
};

// const Student = ({
//   id,
//   name,
//   onRemoveStudent,
// }: StudentProps & { onRemoveStudent: (id: string) => void }) => {
//   const [isHovered, setIsHovered] = useState(false);
//   const avatar = name.split(" ").join("").toUpperCase().slice(0, 1);

//   return (
//     <div
//       role="button"
//       className="student"
//       onMouseEnter={() => setIsHovered(true)}
//       onMouseLeave={() => setIsHovered(false)}
//     >
//       <Avatar avatar={avatar} />
//       <p className="student-name">{name}</p>
//       {isHovered ? (
//         <button type="button" onClick={() => onRemoveStudent(id)}>
//           [-]
//         </button>
//       ) : null}
//     </div>
//   );
// };

const Student = ({
  id,
  name,
  onRemoveStudent,
  onEditStudentName,
}: StudentProps & {
  onRemoveStudent: (id: string) => void;
  onEditStudentName: (id: string, name: string) => void;
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedName, setEditedName] = useState(name);
  const [showRemove, setShowRemove] = useState(false);
  const nameRef = useRef<HTMLInputElement>(null);

  const avatar = name.split(" ").join("").toUpperCase().slice(0, 1);

  const removeIsVisible = showRemove && !isEditing;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(e.target.value);
  };

  const handleNameSubmit = (e: FormEvent) => {
    e.preventDefault();
    onEditStudentName(id, editedName);
    setIsEditing(false);
    nameRef.current?.blur();
  };

  console.log("Student render", id);

  const onMouseMove = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const rect = target.closest("article")?.getBoundingClientRect();
    if (!rect) return;
    const x = e.clientX - rect.left;
    if (x > rect.width - 50 && !isEditing) setShowRemove(true);
  };

  useEffect(() => {
    const expensiveComputation = () => {
      let result = 0;
      for (let i = 0; i < 100000000; i++) {
        result += i;
      }
      return result;
    };
    expensiveComputation();
  });

  const removeHover = () => {
    if (!isEditing) setShowRemove(false);
  };

  return (
    <article
      className={classes.student}
      onMouseMove={onMouseMove}
      onMouseLeave={removeHover}
    >
      <div className={classes.wrapper}>
        <Avatar avatar={avatar} />
        <form onSubmit={handleNameSubmit}>
          <div className={classes.field}>
            <input
              type="text"
              ref={nameRef}
              value={editedName}
              onChange={handleNameChange}
              onClick={() => setIsEditing(true)}
              onBlur={() => {
                setIsEditing(false);
                setShowRemove(false);
              }}
              className={isEditing ? classes.input : classes.inputMuted}
            />
          </div>
        </form>
      </div>
      {removeIsVisible && (
        <button
          type="button"
          onClick={() => onRemoveStudent(id)}
          className={classes.remove}
        >
          <X size={16} />
          <span className="sr-only">Remove student</span>
        </button>
      )}
    </article>
  );
};

export default Student;
