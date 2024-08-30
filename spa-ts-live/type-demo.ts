// Primitives

type ID = string;

type HabitObject = {
  id: ID;
  title: string;
  createdAt: string | Date;
};

type HabitArray = HabitObject[];

const habits: HabitArray = [
  {
    id: "test",
    title: "test",
    createdAt: new Date(),
  },
];

type HabitTitle = Pick<HabitObject, "title">;

const title: HabitTitle = {
  title: "test",
  createdAt: new Date(),
};

type CreateHabitDTO = Omit<HabitObject, "id">;

const createHabit: CreateHabitDTO = {
  id: "test",
  title: "test",
  createdAt: new Date(),
};

type FancyId = `${string}-${string}-${string}`;

type HabitFancyId = {
  id: FancyId;
  title: string;
};

const habitsFancy: HabitFancyId[] = [
  {
    id: "test-a-b",
    title: "test",
  },
];

type StudentMeta = { name: string; birthYear: number };

type StudentRecord = Record<FancyId, StudentMeta>;

type Student = string | StudentRecord;

const getStudent = async (
  students: Student[],
  id: FancyId
): Promise<StudentRecord | undefined | never> => {
  if (students.every((s) => typeof s === "string"))
    throw new Error("Can not locate user when all are strings");
  return students
    .filter((student) => typeof student !== "string")
    .find((student) => student[id]);
};

type MappedStudent = Record<number, StudentMeta & { age: number }>;

const mapStudents = (students: Student[]) => {
  const currentYear = Number(new Date().getFullYear());
  return students.map((student) => {
    if (typeof student === "string") return student;
    return Object.fromEntries(
      Object.entries(student).map(([id, student]) => [
        id,
        {
          ...student,
          age: currentYear - student.birthYear,
        },
      ])
    ) as MappedStudent;
    // Feiler hvis vi prøver å bruke den slik den står nå
    // Issue med TS og vi må si noe vi vet til TS
  });
};

type StudentWithYear = ReturnType<typeof mapStudents>;

getStudent(["a", "b"], `a-b-c`).catch((e) => {
  console.error(e);
});

getStudent(["a", { "a-b-c": { name: "Test", birthYear: 1992 } }], `a-b-c`)
  .then((value) => console.log(value))
  .catch((e) => {
    console.error(e);
  });

getStudent(["a", { "a-b-d": { name: "Test", birthYear: 1992 } }], `a-b-c`)
  .then((value) => console.log(value))
  .catch((e) => {
    console.error(e);
  });

mapStudents(["a", { "a-b-c": { name: "Test", birthYear: 1992 } }]); //?
