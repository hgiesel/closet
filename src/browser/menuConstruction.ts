export interface MenuItem {
    label: string;
    itemId: string;
    html?: boolean;
    clickEvent?: (event: MouseEvent) => void;
    sub?: MenuItem[];
}

const processMenuItem = (item: MenuItem) => {
    const liElement = document.createElement("li");
    const aElement = document.createElement("a");

    if (item.html) {
        aElement.innerHTML = item.label;
    } else {
        aElement.innerText = item.label;
    }

    aElement.id = item.itemId;
    aElement.classList.add("context-menu-item");

    if (item.clickEvent) {
        aElement.addEventListener("click", item.clickEvent);
    }

    liElement.appendChild(aElement);

    if (item.sub && item.sub.length > 0) {
        liElement.appendChild(processMenuItems(item.sub));
    }

    return liElement;
};

const processMenuItems = (items: MenuItem[]) => {
    const ulElement = document.createElement("ul");
    const liElements = items.map(processMenuItem);

    for (const li of liElements) {
        ulElement.appendChild(li);
    }

    return ulElement;
};

export const constructMenu = (
    menuId: string,
    items: MenuItem[],
): HTMLElement => {
    const navElement = document.createElement("nav");
    navElement.classList.add("context-menu");
    navElement.id = menuId;
    navElement.appendChild(processMenuItems(items));

    return navElement;
};
