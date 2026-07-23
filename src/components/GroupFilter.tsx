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
      {groups.filter(g => g.name === 'all' || g.count > 0).map((group) => {
        const isActive = group.name === (active ?? 'all')
        return (
          <button
            key={group.name}
            onClick={() => onChange(group.name === 'all' ? null : group.name)}
            className={[
              'rounded-full px-4 py-1.5 text-sm font-medium transition-all duration-300 whitespace-nowrap cursor-pointer active:scale-95',
              isActive
                ? 'bg-linear-to-r from-surface-accent to-cyan-500 text-text-on-accent shadow-md hover:shadow-lg'
                : 'bg-surface-secondary text-text-secondary hover:bg-border hover:scale-105',
            ].join(' ')}
          >
            {group.label}
            <span className="ml-1.5 opacity-70">({group.count})</span>
          </button>
        )
      })}
    </div>
  )
}
