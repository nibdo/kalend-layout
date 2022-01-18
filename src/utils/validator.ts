import { LayoutRequestData } from '..';

export const validateInput = (data: LayoutRequestData) => {
  if (!Array.isArray(data?.events)) {
    throw Error('Events must be array');
  }
};
