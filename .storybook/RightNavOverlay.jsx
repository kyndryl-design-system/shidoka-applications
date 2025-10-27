import { useEffect } from 'react';

import menuIcon from '@kyndryl-design-system/shidoka-icons/svg/monochrome/32/hamburger-menu.svg';

export const RightNavDropdown = () => {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    // --- Helper class ---
    const applyStyles = (el, styles) => Object.assign(el.style, styles);

    const createEl = (tag, styles, text) => {
      const el = document.createElement(tag);
      if (styles) applyStyles(el, styles);
      if (text) el.textContent = text;
      return el;
    };

    // --- Create container ---
    const container = createEl('div', {
      position: 'fixed',
      top: '80px',
      right: '20px',
      zIndex: 1000,
    });
    document.body.appendChild(container);

    // --- Create button ---
    const button = createEl('button', {
      padding: '8px 12px',
      borderRadius: '6px',
      border: '1px solid #ccc',
      background: '#fff',
      color: '#333',
      cursor: 'pointer',
      fontWeight: 500,
      display: 'flex',
      alignItems: 'center',
    });
    button.id = 'right-nav-dropdown-button';

    container.appendChild(button);

    // const icon = createEl(
    //   'span',
    //   { marginLeft: 'auto', fontSize: '1rem' },
    //   '≡'
    // );

    // --- create icon container---
    const iconContainer = document.createElement('span');
    iconContainer.innerHTML = menuIcon;

    Object.assign(iconContainer.style, {
      marginLeft: 'auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      width: '16px',
      height: '16px',
    });

    const svg = iconContainer.querySelector('svg');
    if (svg) {
      Object.assign(svg.style, {
        width: '16px',
        height: '16px',
        fill: 'currentColor',
        display: 'block',
      });
    }
    button.appendChild(iconContainer);

    // --- dropdown ---
    const dropdown = createEl('div', {
      position: 'absolute',
      right: 0,
      background: '#fff',
      border: '1px solid #ccc',
      color: '#333',
      borderRadius: '8px',
      boxShadow: '0 4px 16px rgba(0,0,0,0.2)',
      minWidth: '200px',
      maxHeight: '70vh',
      overflowY: 'auto',
      display: 'none',
      flexDirection: 'column',
      padding: '8px 0',
      fontSize: '12px',
    });
    container.appendChild(dropdown);

    const header = createEl(
      'div',
      {
        padding: '8px 16px',
        fontWeight: '500',
        fontSize: '14px',
        color: '#5a5555ff',
        borderBottom: '1px solid #eee',
        marginBottom: '4px',
      },
      'On this page'
    );
    dropdown.prepend(header);

    // ---------- Hide overlay for >=1024px screen  ----------

    const style = document.createElement('style');
    style.textContent = `
      @media (max-width: 1024px) {
        #right-nav-dropdown-button {
          display: none !important;
        }
      }
    `;
    document.head.appendChild(style);

    // --- Show dropdown on hover ---
    const showDropdown = () => {
      dropdown.style.display = 'flex';
      if (dropdown.closeTimeout) {
        clearTimeout(dropdown.closeTimeout);
        dropdown.closeTimeout = null;
      }
    };
    button.addEventListener('mouseenter', showDropdown);

    // --- Hide dropdown ---
    const hideDropdown = (e) => {
      if (
        !button.contains(e.relatedTarget) &&
        !dropdown.contains(e.relatedTarget)
      ) {
        dropdown.closeTimeout = setTimeout(() => {
          dropdown.style.display = 'none';
          dropdown.closeTimeout = null;
        }, 150);
      }
    };
    button.addEventListener('mouseleave', hideDropdown);
    dropdown.addEventListener('mouseleave', hideDropdown);

    // --- Find headings & exclude not required headings---
    const excludeHeadings = [
      'stories',
      'additional stories',
      'tag',
      'checkbox group',
      'anatomy',
      'usage',
      'js import',
      'html tag',
      'mascot images',
      'depricated tag colours',
      'properties',
      'examples',
    ];
    const sections = Array.from(
      document.querySelectorAll(
        'article h2[id], article h3[id], .docs-story h3[id], h2[id], h3[id]'
      )
    ).filter((section) => {
      const text = section.textContent.trim().toLowerCase();
      return !excludeHeadings.includes(text);
    });

    // --- Create list items ---
    const itemsMap = new Map();

    sections.forEach((sec) => {
      const item = document.createElement('div');
      item.textContent = sec.textContent;
      Object.assign(item.style, { padding: '6px 16px', cursor: 'pointer' });

      // scroll
      item.addEventListener('click', () => {
        const target = document.getElementById(sec.id);
        if (target) {
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', `#${sec.id}`);
        }
        highlightItem(sec.id);
        dropdown.style.display = 'none';
      });

      // Hover
      item.addEventListener('mouseenter', () => {
        item.style.background = '#f5f5f5';
      });
      item.addEventListener('mouseleave', () => {
        if (item.style.fontWeight !== '600') item.style.background = '';
      });

      dropdown.appendChild(item);
      itemsMap.set(sec.id, item);
    });

    // --- Highlight item---
    const highlightItem = (id) => {
      itemsMap.forEach((item, key) => {
        if (key === id) {
          item.style.background = '#f0f0f0';
          item.style.fontWeight = '600';
          item.style.color = '#007AFF';
        } else {
          item.style.background = '';
          item.style.fontWeight = '';
          item.style.color = '';
        }
      });
    };

    // --- Scrollspy ---
    const onScroll = () => {
      dropdown.style.display = 'none';
      let currentId = sections[0]?.id || null;
      const scrollY = window.scrollY;
      const viewportHeight = window.innerHeight;
      const pageBottom = scrollY + viewportHeight;

      for (const sec of sections) {
        const rect = sec.getBoundingClientRect();
        const topOffset = 80;
        const secTop = window.scrollY + rect.top;

        if (scrollY + topOffset >= secTop) {
          currentId = sec.id;
        }
      }

      // highlight the last section at the bottom of the page
      if (
        window.innerHeight + window.scrollY >=
        document.body.scrollHeight - 2
      ) {
        currentId = sections[sections.length - 1].id;
      }

      if (currentId) highlightItem(currentId);
    };
    window.addEventListener('scroll', onScroll);

    // Cleanup
    return () => {
      window.removeEventListener('scroll', onScroll);
      if (dropdown.closeTimeout) clearTimeout(dropdown.closeTimeout);
      container.remove();
    };
  }, []);

  return null;
};
