import {
  DEFAULT_PAGINATION_LIMIT,
  DEFAULT_PAGINATION_OFFSET,
} from '../../utils';

export const invalidPaginationScenarios = [
  {
    query: { offset: undefined, limit: DEFAULT_PAGINATION_LIMIT },
    reason: 'with empty offset',
  },
  {
    query: { offset: DEFAULT_PAGINATION_OFFSET, limit: undefined },
    reason: 'with empty limit',
  },
  {
    query: { offset: -1, limit: DEFAULT_PAGINATION_LIMIT },
    reason: 'with offset lower than minimum allowed',
  },
  {
    query: { offset: DEFAULT_PAGINATION_OFFSET, limit: 9 },
    reason: 'with limit lower than minimum allowed',
  },
  {
    query: { offset: DEFAULT_PAGINATION_OFFSET, limit: 301 },
    reason: 'with limit higher than maximum allowed',
  },
];

export const invalidUserScenarios = [
  { property: 'email', value: 'test@.com' },
  { property: 'firstName', value: 'a' },
  {
    property: 'firstName',
    value: 'here is some random super ultra hyper big first name',
  },
  { property: 'lastName', value: 'a' },
  {
    property: 'lastName',
    value: 'here is some random super ultra hyper big last name',
  },
  { property: 'password', value: 'Abc1234' },
];
