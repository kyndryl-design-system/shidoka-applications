import { SORT_DIRECTION } from '../defs';

export const getRandomName = () => {
  const fNames = [
    { name: 'Jon', gender: 'male' },
    { name: 'Cersei', gender: 'female' },
    { name: 'Arya', gender: 'female' },
    { name: 'Tywin', gender: 'male' },
    { name: 'Tyrion', gender: 'male' },
    { name: 'Jaime', gender: 'male' },
    { name: 'Daenerys', gender: 'female' },
    { name: 'Sansa', gender: 'female' },
    { name: 'Ned', gender: 'male' },
    { name: 'Brandon', gender: 'male' },
    { name: 'Catelyn', gender: 'female' },
    { name: 'Joffrey', gender: 'male' },
    { name: 'Robert', gender: 'male' },
    { name: 'Theon', gender: 'male' },
    { name: 'Jorah', gender: 'male' },
    { name: 'Petyr', gender: 'male' },
    { name: 'Viserys', gender: 'male' },
    { name: 'Robb', gender: 'male' },
    { name: 'Bran', gender: 'male' },
    { name: 'Samwell', gender: 'male' },
    { name: 'Sandor', gender: 'male' },
    { name: 'Bronn', gender: 'male' },
    { name: 'Varys', gender: 'male' },
    { name: 'Shae', gender: 'female' },
    { name: 'Talisa', gender: 'female' },
  ];

  const lNames = [
    'Snow',
    'Lannister',
    'Stark',
    'Targaryen',
    'Baratheon',
    'Greyjoy',
    'Martell',
    'Tully',
    'Arryn',
    'Tyrell',
    'Frey',
    'Bolton',
    'Mormont',
    'Clegane',
    'Tarly',
    'Meryn',
    'Trant',
    'Drogo',
    '',
  ];

  const fNRandomIndex = Math.floor(Math.random() * fNames.length);
  const lNRandomIndex = Math.floor(Math.random() * lNames.length);
  return [
    fNames[fNRandomIndex].name,
    lNames[lNRandomIndex],
    fNames[fNRandomIndex].gender,
  ];
};

export const getRandomBirthDate = () => {
  // Define the start and end dates for the range
  const startDate = new Date('1940-01-01');
  const endDate = new Date();

  // Calculate the time difference in milliseconds
  const timeDiff = endDate.getTime() - startDate.getTime();

  // Generate a random number between 0 and the time difference
  const randomTime = Math.random() * timeDiff;

  // Add the random time to the start date to get the random birthdate
  const randomBirthDate = new Date(startDate.getTime() + randomTime);

  return randomBirthDate.toLocaleDateString();
};

export const ageGenerator = (birthday: string) => {
  // Convert the birthday string to a Date object
  const birthdayDate = new Date(birthday);

  // Get the current date
  const currentDate = new Date();

  // Calculate the age
  let age = currentDate.getFullYear() - birthdayDate.getFullYear();

  // Check if the birthday for this year has already occurred
  // If not, subtract 1 from the age
  if (
    currentDate.getMonth() < birthdayDate.getMonth() ||
    (currentDate.getMonth() === birthdayDate.getMonth() &&
      currentDate.getDate() < birthdayDate.getDate())
  ) {
    age--;
  }
  return age || 1;
};

/**
 * Generates an array of mock data
 * @type {Array<object>}
 */
export const allData = Array(100)
  .fill(0)
  .map((_, index) => {
    const birthday = getRandomBirthDate();
    const age = ageGenerator(birthday);
    const nameAndGender = getRandomName();

    return {
      id: index + 1,
      firstName: nameAndGender[0],
      lastName: nameAndGender[1],
      age,
      birthday,
      gender: nameAndGender[2],
    };
  });

interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  birthday: string;
}

export const sortByFName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc'
      ? a.firstName.localeCompare(b.firstName)
      : b.firstName.localeCompare(a.firstName);
  };
};

export const sortByLName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc'
      ? a.lastName.localeCompare(b.lastName)
      : b.lastName.localeCompare(a.lastName);
  };
};

export const sortById = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc' ? a.id - b.id : b.id - a.id;
  };
};

export const sortByAge = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === 'asc' ? a.age - b.age : b.age - a.age;
  };
};

export const sortByDate = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    const dateA = new Date(a.birthday);
    const dateB = new Date(b.birthday);

    if (sortDirection === 'asc') {
      return dateA.getTime() - dateB.getTime();
    } else if (sortDirection === 'desc') {
      return dateB.getTime() - dateA.getTime();
    } else {
      throw new Error('Invalid sort direction. Use "asc" or "desc".');
    }
  };
};


export const extractData = (dataTable: any, pageNumber: number, pageSize: number) => {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return dataTable.slice(start, end);
};
