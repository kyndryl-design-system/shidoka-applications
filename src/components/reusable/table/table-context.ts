import { createContext } from '@lit/context';

export type TableContextType = {
  dense?: boolean;
  ellipsis?: boolean;
  striped?: boolean;
  checkboxSelection?: boolean;
  stickyHeader?: boolean;
};

export const tableContext = createContext<TableContextType>({
  dense: false,
  ellipsis: false,
  striped: false,
  checkboxSelection: false,
  stickyHeader: false,
});
