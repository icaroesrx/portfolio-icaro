/**
 * How the site decides whether to animate when someone arrives.
 *
 * Whatever is set here, a visitor can always pause or play with the button
 * in the hero, and the browser remembers their choice for the next visit.
 */
export const motionSettings = {
  /**
   * Some people switch on "reduce motion" in their operating system, often
   * because movement on screen makes them dizzy or unwell.
   *
   *   false  The site starts animated for everyone. Those visitors can press
   *          pause.
   *   true   The site starts paused for those visitors, with a "Play
   *          animation" button. Everyone else still starts animated.
   */
  respectSystemSetting: false,

  /**
   * Pause the 3D scene by itself on devices that cannot draw it smoothly
   * (below 20 frames per second for five seconds in a row, typically a
   * browser without graphics acceleration). The visitor gets a "Play
   * animation" button and can run it anyway.
   */
  pauseWhenSlow: true,
}
