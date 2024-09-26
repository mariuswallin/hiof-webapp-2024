const studentName = "Lars"
const lars = {
  name: studentName,
  birthYear: 1992,
  isNew: false,
  role: 'student'
}

const students = [
  lars,
  {
    name: 'Trude',
    birthYear: 1991,
    isNew: true,
    role: 'admin'
  },
  {
    name: 'Ali',
    birthYear: 1989,
    isNew: true,
    role: 'superadmin'
  },
  {
    name: 'Simone',
    birthYear: 2001,
    isNew: true,
    role: 'student'
  }
]

const getStudentAboveBirthYear = (students, birthYear = 1991) => {
  return students.filter(student => student.birthYear > birthYear)
}

const transformStudents = students => students.map(student => ({
  ...student,
  age: new Date().getFullYear() - student.birthYear
}))

const findStudent = (students, name) => {
  return students.find(student => student.name.toLowerCase() === name.toLowerCase())
}

const roles = ['admin', 'superadmin']

const hasAccess = (roles, students) => {
  return students.filter(student => {
    return roles.includes(student.role)
  })
}

const omitName = (students) => {
  //return students.map(({ name, ...rest }) => rest)
  return students.map(student => {
    const { name, ...rest } = student
    return rest
  })
}

const studentsAboveDefault = getStudentAboveBirthYear(students)
const studentsAboveChanged = getStudentAboveBirthYear(students, 2000)
const allNewStudents = students.every(student => student.isNew)
const studentsWithAge = transformStudents(students)
const studentNamedLars = findStudent(students, 'lars')
const adminRoles = hasAccess(['admin'], students)
const studentRoles = hasAccess(['student'], students)
const adminOrSuperAdmins = hasAccess(['admin', 'superadmin'], students)
const studentNameOmitted = omitName(students)

const studentsCopy = [...students]
studentsCopy[1].name = 'Name changed'

// students //?
// studentsCopy //?

const larsDuplicate = { ...lars }
// larsDuplicate.name = "Lars Changes"
// larsDuplicate //?
// lars //?

const hiofLocation = {
  name: 'HIOF',
  street: 'Haldenveien 1',
  postal: '1520',
  contact: {
    email: 'halden@email.no'
  }
}

// const hiofLocationCopy = {
//   ...hiofLocation
// }

// hiofLocationCopy.contact.email = 'demo'
// hiofLocationCopy //?
// hiofLocation //?

// const hiofLocationCopyDeep = structuredClone(hiofLocation)
// hiofLocationCopyDeep.contact.email = 'demo'
// hiofLocationCopyDeep //?
// hiofLocation //?

const studentWithHiofData = {
  ...lars,
  location: hiofLocation
}

const studentWithHiofDataNotNested = {
  ...lars,
  ...hiofLocation
}