const PALETTES = [
  { bg: 'bg-indigo-600', text: 'text-white' },
  { bg: 'bg-blue-600', text: 'text-white' },
  { bg: 'bg-emerald-600', text: 'text-white' },
  { bg: 'bg-purple-600', text: 'text-white' },
  { bg: 'bg-rose-600', text: 'text-white' },
  { bg: 'bg-amber-600', text: 'text-white' },
  { bg: 'bg-teal-600', text: 'text-white' },
  { bg: 'bg-cyan-600', text: 'text-white' },
  { bg: 'bg-violet-600', text: 'text-white' },
  { bg: 'bg-slate-700', text: 'text-white' }
];

export function Avatar({ name = '', firstName = '', lastName = '', size = 'md', className = '' }) {
  const fName = firstName || (name.split(' ')[0] || '');
  const lName = lastName || (name.split(' ')[1] || '');
  const initials = `${fName.charAt(0)}${lName.charAt(0)}`.toUpperCase() || 'EM';

  // Deterministic palette from name
  const charCodeSum = (fName + lName).split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
  const palette = PALETTES[charCodeSum % PALETTES.length];

  const sizeClasses = {
    sm: 'w-7 h-7 text-[10px] rounded-lg',
    md: 'w-9 h-9 text-xs rounded-xl font-semibold',
    lg: 'w-12 h-12 text-sm rounded-2xl font-bold',
    xl: 'w-16 h-16 text-lg rounded-2xl font-bold'
  }[size] || 'w-9 h-9 text-xs rounded-xl font-semibold';

  return (
    <div
      className={`inline-flex items-center justify-center select-none shrink-0 shadow-xs tracking-wider ${palette.bg} ${palette.text} ${sizeClasses} ${className}`}
      title={`${fName} ${lName}`}
    >
      {initials}
    </div>
  );
}
