/**
 * The timeline in the About section, in order.
 *
 *   place    Where this chapter happened.
 *   title    What it was.
 *   org      Optional organization name.
 *   detail   One sentence of context.
 *   current  Set to true on the chapter that is still in progress.
 */
export const journey = [
  {
    place: 'Brazil',
    title: 'Degree in Systems Analysis & Development',
    detail:
      'The foundation: programming, databases, and how software systems are analyzed, designed and built.',
  },
  {
    place: 'Pernambuco, Brazil',
    title: 'IT & Front-End Specialist',
    org: 'Secretaria da Mulher do Estado de Pernambuco',
    detail:
      "Combined IT work with front-end development in the public sector, at Pernambuco's State Secretariat for Women.",
  },
  {
    place: 'Brazil to Spain',
    title: 'Relocation to Burgos',
    detail: 'A move across the Atlantic, from Brazil to Burgos in northern Spain.',
  },
  {
    place: 'Burgos, Spain',
    title: 'Web Application Development (DAW)',
    detail: 'Currently specializing in full-stack web application development.',
    current: true,
  },
]
