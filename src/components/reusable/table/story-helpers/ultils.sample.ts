import { SORT_DIRECTION } from '../defs';
interface Person {
  id: number;
  firstName: string;
  lastName: string;
  age: number;
  birthday: string;
  deposits?: number;
}

export const sortByFName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === SORT_DIRECTION.ASC
      ? a.firstName.localeCompare(b.firstName)
      : b.firstName.localeCompare(a.firstName);
  };
};

export const sortByLName = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === SORT_DIRECTION.ASC
      ? a.lastName.localeCompare(b.lastName)
      : b.lastName.localeCompare(a.lastName);
  };
};

export const sortById = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === SORT_DIRECTION.ASC ? a.id - b.id : b.id - a.id;
  };
};

export const sortByAge = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    return sortDirection === SORT_DIRECTION.ASC ? a.age - b.age : b.age - a.age;
  };
};

export const sortByDate = (sortDirection: SORT_DIRECTION) => {
  return (a: Person, b: Person) => {
    const dateA = new Date(a.birthday);
    const dateB = new Date(b.birthday);

    if (sortDirection === SORT_DIRECTION.ASC) {
      return dateA.getTime() - dateB.getTime();
    } else if (sortDirection === SORT_DIRECTION.DESC) {
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
    unread: true,
    deposits: 2500,
  },
  {
    id: 2,
    firstName: 'Daenerys',
    lastName: 'Targaryen',
    age: 22,
    birthday: 'April 23',
    fullname: 'Daenerys Targaryen',
    gender: 'Female',
    expanded: true,
    deposits: 5500,
  },
  {
    id: 3,
    firstName: 'Tyrion',
    lastName: 'Lannister',
    age: 39,
    birthday: 'June 12',
    fullname: 'Tyrion Lannister',
    gender: 'Male',
    deposits: 10000,
  },
  {
    id: 4,
    firstName: 'Arya',
    lastName: 'Stark',
    age: 18,
    birthday: 'February 15',
    fullname: 'Arya Stark',
    gender: 'Female',
    deposits: 8000,
  },
  {
    id: 5,
    firstName: 'Cersei',
    lastName: 'Lannister',
    age: 42,
    birthday: 'November 30',
    fullname: 'Cersei Lannister',
    gender: 'Female',
    deposits: 12000,
  },
];

export const dataForColumns = [
  {
    id: 'row1',
    col1: 'Column 1',
    col2: 'Column 2',
    col3: 'Column 3',
    col4: 'Column 4',
    col5: 'Column 5',
    col6: 'Column 6',
    col7: 'Column 7',
    col8: 'Column 8',
    col9: 'Column 9',
    col10: 'Column 10',
    col11: 'Column 11',
    col12: 'Column 12',
    col13: 'Column 13',
    col14: 'Column 14',
    col15: 'Column 15',
    col16: 'Column 16',
    col17: 'Column 17',
    col18: 'Column 18',
    col19: 'Column 19',
    col20: 'Column 20',
  },
  {
    id: 'row2',
    col1: 'Column 1',
    col2: 'Column 2',
    col3: 'Column 3',
    col4: 'Column 4',
    col5: 'Column 5',
    col6: 'Column 6',
    col7: 'Column 7',
    col8: 'Column 8',
    col9: 'Column 9',
    col10: 'Column 10',
    col11: 'Column 11',
    col12: 'Column 12',
    col13: 'Column 13',
    col14: 'Column 14',
    col15: 'Column 15',
    col16: 'Column 16',
    col17: 'Column 17',
    col18: 'Column 18',
    col19: 'Column 19',
    col20: 'Column 20',
  },
  {
    id: 'row3',
    col1: 'Column 1',
    col2: 'Column 2',
    col3: 'Column 3',
    col4: 'Column 4',
    col5: 'Column 5',
    col6: 'Column 6',
    col7: 'Column 7',
    col8: 'Column 8',
    col9: 'Column 9',
    col10: 'Column 10',
    col11: 'Column 11',
    col12: 'Column 12',
    col13: 'Column 13',
    col14: 'Column 14',
    col15: 'Column 15',
    col16: 'Column 16',
    col17: 'Column 17',
    col18: 'Column 18',
    col19: 'Column 19',
    col20: 'Column 20',
  },
  {
    id: 'row4',
    col1: 'Column 1',
    col2: 'Column 2',
    col3: 'Column 3',
    col4: 'Column 4',
    col5: 'Column 5',
    col6: 'Column 6',
    col7: 'Column 7',
    col8: 'Column 8',
    col9: 'Column 9',
    col10: 'Column 10',
    col11: 'Column 11',
    col12: 'Column 12',
    col13: 'Column 13',
    col14: 'Column 14',
    col15: 'Column 15',
    col16: 'Column 16',
    col17: 'Column 17',
    col18: 'Column 18',
    col19: 'Column 19',
    col20: 'Column 20',
  },
  {
    id: 'row5',
    col1: 'Column 1',
    col2: 'Column 2',
    col3: 'Column 3',
    col4: 'Column 4',
    col5: 'Column 5',
    col6: 'Column 6',
    col7: 'Column 7',
    col8: 'Column 8',
    col9: 'Column 9',
    col10: 'Column 10',
    col11: 'Column 11',
    col12: 'Column 12',
    col13: 'Column 13',
    col14: 'Column 14',
    col15: 'Column 15',
    col16: 'Column 16',
    col17: 'Column 17',
    col18: 'Column 18',
    col19: 'Column 19',
    col20: 'Column 20',
  },
];

export const dataForColumnsFilter = [
  {
    ticketPriority: 'P1',
    applnName: 'Application 01',
    businessService: 'Marketing',
    businessGroups: 'Banking',
    ticketStatus: 'In Progress',
    criticalityRisk: 80,
  },
  {
    ticketPriority: 'P2',
    applnName: 'Application 02',
    businessService: 'Research',
    businessGroups: 'Retail',
    ticketStatus: 'Cancelled',
    criticalityRisk: 74,
  },
  {
    ticketPriority: 'P1',
    applnName: 'Application 03',
    businessService: 'HR',
    businessGroups: 'Healthcare',
    ticketStatus: 'On Hold',
    criticalityRisk: 61,
  },
  {
    ticketPriority: 'P3',
    applnName: 'Application 04',
    businessService: 'Finanace',
    businessGroups: 'Life Science',
    ticketStatus: 'Queued',
    criticalityRisk: 52,
  },
  {
    ticketPriority: 'P4',
    applnName: 'Application 05',
    businessService: 'Training',
    businessGroups: 'Healthcare',
    ticketStatus: 'In Progress',
    criticalityRisk: 42,
  },
  {
    ticketPriority: 'P1',
    applnName: 'Application 06',
    businessService: 'Compliance',
    businessGroups: 'Banking',
    ticketStatus: 'In Progress',
    criticalityRisk: 33,
  },
  {
    ticketPriority: 'P4',
    applnName: 'Application 07',
    businessService: 'Sales',
    businessGroups: 'Banking',
    ticketStatus: 'In Progress',
    criticalityRisk: 20,
  },
];
