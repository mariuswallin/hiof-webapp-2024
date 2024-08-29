const studentName = "Lars";

const lars = {
  name: studentName,
  birthYear: 1992,
  isNew: false,
  role: "student",
};

const students = [
  lars,
  {
    name: "Trude",
    birthYear: 1991,
    isNew: true,
    role: "admin",
  },
  {
    name: "Ali",
    birthYear: 1989,
    isNew: true,
    role: "superadmin",
  },
  {
    name: "Simone",
    birthYear: 2001,
    isNew: true,
    role: 'student'
  }
];

// function getStudentAboveBirthYear() {}

// biome-ignore lint/style/useDefaultParameterLast: <explanation>
const getStudentAboveBirthYear = (students = [], birthYear) => {
  return students.filter((student) => student.birthYear > birthYear)
}

const studentsAbove = getStudentAboveBirthYear(students, 1991)

// const transformStudents = students => {
//   return students.map(student => ({
//     ...student,
//     age: new Date().getFullYear() - student.birthYear
//   }))
// }

const transformStudents = students =>
  students.map(student => ({
    ...student,
    age: new Date().getFullYear() - student.birthYear
  }))

const studentsWithAge = transformStudents(students)

const findStudent = (students, name) => {
  return students.find(student => student.name.toLowerCase() === name?.toLowerCase())
}

const studentFound = findStudent(students, 'lars')

const roles = ['admin', 'superadmin']

const hasAccess = (roles, students) => {
  return students.filter(student => {
    return roles.includes(student.role)
  })
}

const adminRoles = hasAccess(['admin'], students)
const studentRoles = hasAccess(['student'], students)
const adminOrSuperAdmins = hasAccess(['admin', 'superadmin'], students)

const omitName = (students) => {
  return students.map(student => {
    const { name, ...rest } = student
    return rest
  })
}

const omitNameSimple = students => students.map(({ name, ...rest }) => rest)

const studentNameOmitted = omitName(students)

const studentCopy = [...students]

studentCopy[1].name = 'Name changed'

const larsCopy = { ...lars }
larsCopy.name = "Lars Changes"
larsCopy //?
lars //?

const hiofLocation = {
  name: 'HIOF',
  street: 'Haldenveien 1',
  postal: '1520',
  contact: {
    email: 'halden@email.no'
  }
}

const hiofLocationCopy = {
  ...hiofLocation
}

//hiofLocationCopy.contact.email = 'demo'

const hiofLocationDeep = structuredClone(hiofLocation)
hiofLocationDeep.contact.email = 'demo'


const studentWithHiofData = {
  ...lars,
  location: hiofLocation
}