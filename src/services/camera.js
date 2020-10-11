export async function getCamera (shouldFaceUser) {
  const facingModeList = shouldFaceUser
    ? ['user', 'environment']
    : ['environment', 'user']

  const [preferredFacingMode] = facingModeList

  const constraintsList = [
    ...facingModeList.map(facingMode => ({ exact: facingMode })),
    preferredFacingMode
  ].map(facingModeConstraint => ({ video: { facingMode: facingModeConstraint } }))

  for (const constraints of constraintsList) {
    try {
      console.log(constraints)
      return {
        mediaStream: await navigator.mediaDevices.getUserMedia(constraints),
        facingMode: constraints.video.facingMode.exact ? constraints.video.facingMode.exact : 'unknow'
      }
    } catch (error) {
      console.log(error)
      if (error.name !== 'OverconstrainedError' && error.constraint === 'facingMode') {
        throw error
      }
    }
  }

  throw new Error('Overconstrained')
}
