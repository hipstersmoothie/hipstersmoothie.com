import makeClass from 'clsx';

interface HeaderProps {
  active?: 'garden'
}

export const Header = ({active}: HeaderProps) => {
  return (
    <div className="h-16 border-b">
      <div className="h-full flex items-center justify-between px-4 max-w-[100ch] mx-auto">
        <div className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-br from-[#F39AC0] to-[#F06D99]">hipstersmoothie.com</div>

        <div className="text-lg">
          <a className={makeClass(active === 'garden' && 'font-medium')}>Digital Garden</a>
        </div>
      </div>
    </div>
  )
}