import React, {createContext, forwardRef, memo} from 'react';

const Theme = {
  LIGHT: 'light',
  DARK: 'dark'
};

export const ThemeContext = createContext();

const getComponentName = Component => {
  if (Component.name !== null && Component.name !== undefined) {
    return Component.name;
  }
  if (Component.displayName !== null && Component.displayName !== undefined) {
    return Component.displayName;
  }
  return 'Component';
};

const getDisplayName = Component => (
  typeof Component === 'string' ? Component : getComponentName(Component)
);

export const withTheme = (defaultTheme = Theme.LIGHT) => ComposedComponent => {
  // eslint-disable-next-line react/prop-types
  const WithTheme = memo(forwardRef(function WithTheme({theme, ...restProps}, ref) {
    return (
      <ThemeContext.Consumer>
        {contextTheme => {
          const usedTheme = theme || contextTheme || defaultTheme;
          return (
            <ThemeContext.Provider value={usedTheme}>
              <ComposedComponent
                ref={ref}
                {...restProps}
                theme={usedTheme}
              />
            </ThemeContext.Provider>
          );
        }}
      </ThemeContext.Consumer>
    );
  }));
  Object.assign(WithTheme, ComposedComponent);
  WithTheme.displayName = `withTheme(${getDisplayName(ComposedComponent)})`;
  return WithTheme;
};

function applyTheme(params) {
  if (!params || !params.element || !params.currentTheme) {
    return;
  }

  if (params.prevTheme) {
    params.element.classList.remove(params.prevTheme);
  }

  params.element.classList.add(params.currentTheme);
}


export {applyTheme};
export default Theme;
