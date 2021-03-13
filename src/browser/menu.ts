import type { MenuItem } from "./menuConstruction";
import { constructMenu } from "./menuConstruction";

export const menuCss = `
:root {
  --cm-niceblue: #3f8cf1;
  --cm-nicegray: #444;
  --cm-backgray: #ececec;
  --cm-boxgray: #cfcfcf;
}

nav.context-menu {
  position: absolute;
  z-index: 9999;
  display: none;
}

nav.context-menu--active {
  display: block;
}

/******************** UL */

nav.context-menu ul {
  position: absolute;

  padding: 0.2rem 0;
  width: 10rem;

  white-space: nowrap;
  list-style: none;

  background-color: var(--cm-backgray);
  border: solid 1px var(--cm-boxgray);
  box-shadow: 1px 1px 2px var(--cm-boxgray);
}

/******************** LI */

nav.context-menu li {
  margin-bottom: 2px;
}

nav.context-menu li.context-menu--hover {
  background-color: var(--cm-niceblue);
}

nav.context-menu li:last-child {
  margin-bottom: 0;
}

nav.context-menu li ul {
  display: none;
  margin-left: 2rem;
}

nav.context-menu li.context-menu--hover ul {
  display: block;
}

nav.context-menu li li ul {
  display: none;
  margin-left: 4rem;
}

nav.context-menu li li.context-menu--hover ul {
  display: block;
}

/******************** A */

nav.context-menu a {
  display: block;
  padding: 0.3rem 1rem;
  user-select: none;

  color: var(--cm-nicegray);
}

nav.context-menu li.context-menu--hover a {
  color: white;
}
`;

const turnOffMenu = (menu: HTMLElement) => () => {
    menu.classList.remove("context-menu--active");
};

const positionMenu = (menu: HTMLElement, x: number, y: number) => {
    menu.style.left = `${x}px`;
    menu.style.top = `${y}px`;
};

///////////////////

const initializeMenu = (menu: HTMLElement): void => {
    menu.addEventListener("click", (event: MouseEvent) => {
        event.stopPropagation();
    });

    menu.querySelectorAll("li").forEach((liElement: HTMLLIElement): void => {
        liElement.addEventListener("mouseenter", () => {
            liElement.classList.add("context-menu--hover");
        });

        liElement.addEventListener("mouseleave", () => {
            liElement.classList.remove("context-menu--hover");
        });

        liElement.addEventListener("click", () => {
            turnOffMenu(menu)();
        });
    });
};

export const enableAsMenuTrigger = (menu: HTMLElement, where: EventTarget): void => {
    const turnOffTheMenu = turnOffMenu(menu);

    where.addEventListener("contextmenu", (event: any /* MouseEvent */) => {
        event.preventDefault();
        event.stopPropagation();

        document
            .querySelectorAll(".context-menu--active")
            .forEach((element) =>
                element.classList.remove("context-menu--active"),
            );

        menu.classList.add("context-menu--active");

        window.addEventListener("click", turnOffTheMenu, { once: true });
        positionMenu(menu, event.pageX, event.pageY);
    });
};

export const setupMenu = (
    menuName: string,
    menuItems: MenuItem[],
): HTMLElement => {
    const menu = constructMenu(menuName, menuItems);

    document.body.insertAdjacentElement("beforeend", menu);
    initializeMenu(menu);

    return menu;
};
