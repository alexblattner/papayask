export const socialName = (social: string) => {
  if (social.includes('facebook')) {
    return 'facebook';
  }
  if (social.includes('pinterest')) {
    return 'pinterest';
  }
  if (social.includes('instagram')) {
    return 'instagram';
  }
  if (social.includes('deviantart')) {
    return 'deviantart';
  }
  if (social.includes('youtube')) {
    return 'youtube';
  }
  if (social.includes('behance')) {
    return 'behance';
  }
  if (social.includes('dribbble')) {
    return 'dribbble';
  }
  if (social.includes('artstation')) {
    return 'artstation';
  } else {
    return 'world';
  }
};
