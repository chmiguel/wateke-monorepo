export default class UserPostsMaxReachedError extends Error {
  constructor(maxNumberOfPostsPerUser: number) {
    super(
      `Solo puedes tener un máximo de ${maxNumberOfPostsPerUser} canciones en el playlist de este Spot.`,
    );
  }
}
