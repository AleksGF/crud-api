import { UserWithoutId } from '../types/types';

const areAllPropertiesPresent = (userData: Partial<UserWithoutId>) =>
  'username' in userData && 'age' in userData && 'hobbies' in userData;

const isAnyPropertyPresent = (userData: Partial<UserWithoutId>): boolean =>
  'username' in userData || 'age' in userData || 'hobbies' in userData;

const areAllPropertiesTypesCorrect = (
  userData: Partial<UserWithoutId>,
): boolean =>
  !(
    ('username' in userData && typeof userData.username !== 'string') ||
    ('age' in userData && typeof userData.age !== 'number') ||
    ('hobbies' in userData &&
      (!Array.isArray(userData.hobbies) ||
        userData.hobbies.some((hobby) => typeof hobby !== 'string')))
  );

export const isUserDataValid = (user: unknown): user is UserWithoutId => {
  return !(
    !user ||
    typeof user !== 'object' ||
    !areAllPropertiesPresent(user) ||
    !areAllPropertiesTypesCorrect(user)
  );
};

export const isPartialUserDataValid = (
  userData: unknown,
): userData is Partial<UserWithoutId> => {
  return !(
    !userData ||
    typeof userData !== 'object' ||
    !isAnyPropertyPresent(userData) ||
    !areAllPropertiesTypesCorrect(userData)
  );
};
