interface GroupCount {
  name: string
  label: string
  count: number
}

interface GroupFilterProps {
  groups: GroupCount[]
  active: string | null
  onChange: (name: string | null) => void
}

export function GroupFilter({ groups, active, onChange }: GroupFilterProps) {
  return (
    <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
      {groups.map((group) => (
        <button
          key={group.name}
          onClick={() => onChange(group.name === 'all' ? null : group.name)}
          className={[
            'rounded-full px-4 py-1.5 text-sm font-medium transition-all whitespace-nowrap',
            group.name === (active ?? 'all')
              ? 'bg-surface-accent text-text-on-accent'
              : 'bg-surface-secondary text-text-secondary hover:bg-border',
          ].join(' ')}
        >
          {group.label}
          <span className="ml-1.5 opacity-60">({group.count})</span>
        </button>
      ))}
    </div>
  )
}
