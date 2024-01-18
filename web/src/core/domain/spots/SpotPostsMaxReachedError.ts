export default class SpotPostsMaxReachedError extends Error {
  constructor(maxNumberOfPostsForSpot: number) {
    super(
      `Se ha alcanzado el límite de postulaciones de este Spot: ${maxNumberOfPostsForSpot} canciones`,
    );
  }
}
