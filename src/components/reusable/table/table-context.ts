import { createContext } from '@lit/context';

export type TableContextType = {
  dense?: boolean;
  striped?: boolean;
  checkboxSelection?: boolean;
  stickyHeader?: boolean;
  enableBulkSelection?: boolean;
};

export const tableContext = createContext<TableContextType>({
  dense: false,
  striped: false,
  checkboxSelection: false,
  stickyHeader: false,
  enableBulkSelection: false,
});
