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
    <div className="flex justify-center pb-4 mb-6">
      <div className="flex gap-0 overflow-x-auto max-w-full">
        {groups.filter(g => g.name === 'all' || g.count > 0).map((group) => {
          const isActive = group.name === (active ?? 'all')
          return (
            <button
              key={group.name}
              onClick={() => onChange(group.name === 'all' ? null : group.name)}
              className={[
                'font-mono text-xs font-medium px-4 py-1.5 border-2 border-border -ml-0.5 first:ml-0 hover:relative hover:z-10 whitespace-nowrap cursor-pointer transition-colors duration-150',
                isActive
                  ? 'bg-text text-bg border-text'
                  : 'bg-transparent text-text-muted hover:bg-surface hover:border-text',
              ].join(' ')}
            >
              {group.label}
              <span className="ml-1 opacity-50">[{group.count}]</span>
            </button>
          )
        })}
      </div>
    </div>
  )
}
