import { Monitor, Moon, Palette, PanelLeft, PanelTop, Sun } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

type Theme = 'light' | 'dark' | 'odoo' | 'system';
type LayoutStyle = 'top' | 'sidebar';

export default function AppearanceDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('theme') as Theme) || 'odoo';
  });
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>(() => {
    return (localStorage.getItem('layoutStyle') as LayoutStyle) || 'top';
  });
  
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useEffect(() => {
    // Apply theme
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'odoo');
    
    if (theme === 'system') {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.add(prefersDark ? 'dark' : 'light');
    } else {
      root.classList.add(theme);
    }
    
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    // Apply layout style
    document.body.setAttribute('data-layout', layoutStyle);
    localStorage.setItem('layoutStyle', layoutStyle);
    
    // Trigger re-render of layout
    window.dispatchEvent(new Event('layoutChange'));
  }, [layoutStyle]);

  const themeOptions = [
    { value: 'light' as Theme, label: 'Light Mode', icon: Sun, description: 'Clean light interface' },
    { value: 'dark' as Theme, label: 'Dark Mode', icon: Moon, description: 'Easy on the eyes' },
    { value: 'odoo' as Theme, label: 'Odoo Mode', icon: Palette, description: 'Professional ERP style' },
    { value: 'system' as Theme, label: 'System', icon: Monitor, description: 'Match system preference' },
  ];

  const layoutOptions = [
    { value: 'top' as LayoutStyle, label: 'Top Navigation', icon: PanelTop, description: 'Horizontal menu' },
    { value: 'sidebar' as LayoutStyle, label: 'Sidebar Navigation', icon: PanelLeft, description: 'Vertical menu' },
  ];

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-white hover:bg-white hover:bg-opacity-10 p-2 rounded transition"
        title="Appearance Settings"
      >
        <Palette size={20} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden z-50">
          {/* Header */}
          <div className="px-3 py-2 border-b border-gray-200 bg-gray-50">
            <h3 className="text-sm font-semibold text-gray-900">Appearance</h3>
          </div>

          <div className="p-3 space-y-3 bg-white">
            {/* Theme Selection - Compact */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-1.5">Theme</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {themeOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = theme === option.value;
                  
                  // Special styling for Light mode when active
                  const activeClasses = option.value === 'light' && isActive
                    ? 'bg-white text-gray-900 shadow-md border-2 border-gray-400'
                    : isActive
                    ? 'bg-[#714B67] text-white shadow-sm'
                    : 'bg-gray-50 text-gray-600 hover:bg-gray-100';
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setTheme(option.value)}
                      className={`flex flex-col items-center gap-1 px-2 py-2 rounded transition ${activeClasses}`}
                      title={option.description}
                    >
                      <Icon size={16} />
                      <span className="text-xs font-medium">
                        {option.label.replace(' Mode', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Layout Style Selection - Compact */}
            <div>
              <h4 className="text-xs font-medium text-gray-600 mb-1.5">Layout</h4>
              <div className="grid grid-cols-2 gap-1.5">
                {layoutOptions.map((option) => {
                  const Icon = option.icon;
                  const isActive = layoutStyle === option.value;
                  
                  return (
                    <button
                      key={option.value}
                      onClick={() => setLayoutStyle(option.value)}
                      className={`flex flex-col items-center gap-1 px-2 py-2 rounded transition ${
                        isActive
                          ? 'bg-[#714B67] text-white shadow-sm'
                          : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                      }`}
                      title={option.description}
                    >
                      <Icon size={16} />
                      <span className="text-xs font-medium">
                        {option.label.replace(' Navigation', '')}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
          <div className="px-4 py-2 bg-gray-50 border-t border-gray-200">
            <p className="text-xs text-gray-500 text-center">
              Changes apply immediately
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
