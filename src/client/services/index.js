export * from './content-service';
export * from './category-service';
export * from './company-service';
export * from './user-service';
export * from './system-service';

export function generateToken() {
  const token = localStorage.getItem('token');
  return {
    headers: {
      Authorization: 'Bearer ' + token
    }
  };
}
