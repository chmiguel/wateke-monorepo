export class User {
  avatar: string|null;
  email: string|null;
  name: string|null;
  uid: string|null;
  accessToken?: string|null;
  isInitialized?: boolean;

  constructor(initialUser: any) {
    this.avatar = initialUser?.avatar || null;
    this.email = initialUser?.email||null;
    this.name = initialUser?.name||null;
    this.uid = initialUser?.uid||null;
    this.accessToken =initialUser?.accessToken||null;
    this.isInitialized = initialUser?.isInitialized || false;
  }

  update(initialUser: any) {
    this.avatar = initialUser?.avatar || null;
    this.email = initialUser?.email||null;
    this.name = initialUser?.name||null;
    this.uid = initialUser?.uid||null;
    this.accessToken =initialUser?.accessToken||null;
    this.isInitialized = initialUser?.isInitialized || false;
  }
}

export interface SpotUserVM {
  avatar: string|null;
  name: string|null;
  uid: string|null;
  isBlocked: boolean;
}
