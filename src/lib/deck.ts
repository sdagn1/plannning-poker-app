/** Planning poker deck, per the UI design document. */

export interface Card {
  /** Value sent to the server. */
  value: string;
  /** Face label shown on the card. */
  label: string;
  /** Optional flavour subtext. */
  flavour?: string;
  /** When set, render the Death Star icon in place of the text label. */
  icon?: 'deathstar';
}

export const DECK: Card[] = [
  { value: '0', label: '0' },
  { value: '1', label: 'I' },
  { value: '2', label: 'II' },
  { value: '3', label: 'III' },
  { value: '5', label: 'V' },
  { value: '8', label: 'VIII' },
  { value: '13', label: 'XIII' },
  {
    value: '?',
    label: '☠',
    flavour: 'Bad Feeling',
  },
  {
    value: '☕',
    label: '☕',
    flavour: 'Jawa Juice',
  },
  {
    value: '∞',
    label: '∞',
    flavour: 'Death Star',
    icon: 'deathstar',
  },
];
