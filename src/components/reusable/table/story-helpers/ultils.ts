import { SORT_DIRECTION } from '../defs';
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

export const extractData = (
  dataTable: any,
  pageNumber: number,
  pageSize: number
) => {
  const start = (pageNumber - 1) * pageSize;
  const end = start + pageSize;
  return dataTable.slice(start, end);
};

export const characters = [
  {
    id: 1,
    firstName: 'Jon',
    lastName: 'Snow',
    age: 23,
    birthday: 'December 26',
    fullname: 'Jon Snow',
    gender: 'Male',
  },
  {
    id: 2,
    firstName: 'Daenerys',
    lastName: 'Targaryen',
    age: 22,
    birthday: 'April 23',
    fullname: 'Daenerys Targaryen',
    gender: 'Female',
  },
  {
    id: 3,
    firstName: 'Tyrion',
    lastName: 'Lannister',
    age: 39,
    birthday: 'June 12',
    fullname: 'Tyrion Lannister',
    gender: 'Male',
  },
  {
    id: 4,
    firstName: 'Arya',
    lastName: 'Stark',
    age: 18,
    birthday: 'February 15',
    fullname: 'Arya Stark',
    gender: 'Female',
  },
  {
    id: 5,
    firstName: 'Cersei',
    lastName: 'Lannister',
    age: 42,
    birthday: 'November 30',
    fullname: 'Cersei Lannister',
    gender: 'Female',
  },
];
